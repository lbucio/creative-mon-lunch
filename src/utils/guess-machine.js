import * as tf from "@tensorflow/tfjs";
import { Observable } from "rxjs";

import data from "../data/historical";

const lunchData = data.map(week => week.Actual);

class LunchData {
  constructor(dataIdentifier, lunchPlaces, sampleLen, sampleStep) {
    tf.util.assert(
      sampleLen > 0,
      `Expected sampleLen to be a positive integer, but got ${sampleLen}`
    );
    tf.util.assert(
      sampleStep > 0,
      `Expected sampleStep to be a positive integer, but got ${sampleStep}`
    );

    if (!dataIdentifier) {
      throw new Error("Model identifier is not provided.");
    }

    this.dataIdentifier_ = dataIdentifier;

    this.lunchPlaces_ = lunchPlaces;
    this.lunchLen_ = lunchPlaces.length;
    this.sampleLen_ = sampleLen;
    this.sampleStep_ = sampleStep;

    this.getLunchSet_();
    this.convertAllLunchPlacesToIndices_();
  }

  getNameFromIndex(index) {
    return this.lunchSet_[index];
  }

  sampleLen() {
    return this.sampleLen_;
  }

  numRestaurants() {
    return this.lunchSetSize_;
  }

  convertAllLunchPlacesToIndices_() {
    this.indices_ = new Uint16Array(
      this.lunchPlaceToIndices(this.lunchPlaces_)
    );
  }

  lunchPlaceToIndices(lunchPlaces) {
    const indices = [];
    for (let i = 0; i < lunchPlaces.length; ++i) {
      indices.push(this.lunchSet_.indexOf(lunchPlaces[i]));
    }
    return indices;
  }

  getLunchSet_() {
    this.lunchSet_ = [];
    for (let i = 0; i < this.lunchLen_; ++i) {
      if (this.lunchSet_.indexOf(this.lunchPlaces_[i]) === -1) {
        this.lunchSet_.push(this.lunchPlaces_[i]);
      }
    }
    this.lunchSetSize_ = this.lunchSet_.length;
  }

  nextDataEpoch(numExamples) {
    this.generateExampleBeginIndices_();

    if (numExamples == null) {
      numExamples = this.exampleBeginIndices_.length;
    }

    const xsBuffer = new tf.TensorBuffer([
      numExamples,
      this.sampleLen_,
      this.lunchSetSize_
    ]);
    const ysBuffer = new tf.TensorBuffer([numExamples, this.lunchSetSize_]);
    for (let i = 0; i < numExamples; ++i) {
      const beginIndex = this.exampleBeginIndices_[
        this.examplePosition_ % this.exampleBeginIndices_.length
      ];
      for (let j = 0; j < this.sampleLen_; ++j) {
        xsBuffer.set(1, i, j, this.indices_[beginIndex + j]);
      }
      ysBuffer.set(1, i, this.indices_[beginIndex + this.sampleLen_]);
      this.examplePosition_++;
    }
    return [xsBuffer.toTensor(), ysBuffer.toTensor()];
  }

  lunchPlacesToIndices(lunchPlaces) {
    const indices = [];
    for (let i = 0; i < lunchPlaces.length; ++i) {
      indices.push(this.lunchPlaces_.indexOf(lunchPlaces[i]));
    }
    return indices;
  }

  generateExampleBeginIndices_() {
    // Prepare beginning indices of examples.
    this.exampleBeginIndices_ = [];
    for (
      let i = 0;
      i < this.lunchLen_ - this.sampleLen_ - 1;
      i += this.sampleStep_
    ) {
      this.exampleBeginIndices_.push(i);
    }

    // Randomly shuffle the beginning indices.
    tf.util.shuffle(this.exampleBeginIndices_);
    this.examplePosition_ = 0;
  }

  slice_(startIndex, endIndex) {
    return this.lunchPlaces_.slice(startIndex, endIndex);
  }

  getRandomSlice() {
    const startIndex = Math.round(
      Math.random() * (this.lunchLen_ - this.sampleLen_ - 1)
    );
    const lunchSlice = this.slice_(startIndex, startIndex + this.sampleLen_);
    return [lunchSlice, this.lunchPlacesToIndices(lunchSlice)];
  }
}

const sample = (probs, temperature) => {
  return tf.tidy(() => {
    const logits = tf.div(tf.log(probs), Math.max(temperature, 1e-6));
    const isNormalized = false;
    // `logits` is for a multinomial distribution, scaled by the temperature.
    // We randomly draw a sample from the distribution.
    return tf.multinomial(logits, 1, null, isNormalized).dataSync()[0];
  });
};

const createLunchModel = (sampleLen, numRestaurants, lstmLayerSizes) => {
  const model = tf.sequential();
  for (let i = 0; i < lstmLayerSizes.length; ++i) {
    const lstmLayerSize = lstmLayerSizes[i];
    model.add(
      tf.layers.lstm({
        units: lstmLayerSize,
        returnSequences: i < lstmLayerSizes.length - 1,
        inputShape: i === 0 ? [sampleLen, numRestaurants] : undefined
      })
    );
  }
  model.add(tf.layers.dense({ units: numRestaurants, activation: "softmax" }));

  return model;
};

const compileLunchModel = (model, learningRate) => {
  const optimizer = tf.train.rmsprop(learningRate);
  model.compile({ optimizer: optimizer, loss: "categoricalCrossentropy" });
  console.log(`Compiled model with learning rate ${learningRate}`);
  model.summary();
};

const fitLunchModel = async (
  model,
  lunchData,
  numEpochs,
  examplesPerEpoch,
  batchSize,
  validationSplit,
  callbacks
) => {
  for (let i = 0; i < numEpochs; ++i) {
    const [xs, ys] = lunchData.nextDataEpoch(examplesPerEpoch);
    await model.fit(xs, ys, {
      epochs: 1,
      batchSize: batchSize,
      validationSplit,
      callbacks
    });
    xs.dispose();
    ys.dispose();
  }
};

const generateRestaurant = (
  model,
  lunchData,
  sentenceIndices,
  length,
  temperature
) => {
  const sampleLen = model.inputs[0].shape[1];
  const charSetSize = model.inputs[0].shape[2];

  // Avoid overwriting the original input.
  sentenceIndices = sentenceIndices.slice();

  let generated = "";
  while (generated.length < length) {
    // Encode the current input sequence as a one-hot Tensor.
    const inputBuffer = new tf.TensorBuffer([1, sampleLen, charSetSize]);

    // Make the one-hot encoding of the seeding sentence.
    for (let i = 0; i < sampleLen; ++i) {
      inputBuffer.set(1, 0, i, sentenceIndices[i]);
    }
    const input = inputBuffer.toTensor();

    // Call model.predict() to get the probability values of the next
    // character.
    const output = model.predict(input);

    // Sample randomly based on the probability values.
    const winnerIndex = sample(tf.squeeze(output), temperature);
    const winnerName = lunchData.getNameFromIndex(winnerIndex);

    generated += winnerName;

    // Memory cleanups.
    input.dispose();
    output.dispose();
  }
  return generated;
};

export default async function getNextGuess(data = lunchData) {

  // No clue
  const lstmLayerSizes = [32, 32];

  // Magical training number
  const learningRate = 1e-2;

  // Number of training epochs
  const epochs = 30;

  // Number of restaurants to sample in each training epoch
  const examplesPerEpoch = null;

  // Batch size for training (This many restaurants get passed in at a time)
  const batchSize = 6;

  // Validation split for training
  const validationSplit = 0.0625;

  // Number of guesses to display
  const displayLength = 1;

  // Number of restaurants to skip between one example and the next
  const sampleStep = 1;

  // Number of restaurants to pass to the model each input sequence
  const sampleLen = 6;

  const lunchDataObj = new LunchData(
    "lunch-data",
    data,
    sampleLen,
    sampleStep
  );

  // Create the model
  const model = createLunchModel(
    lunchDataObj.sampleLen(),
    lunchDataObj.numRestaurants(),
    lstmLayerSizes
  );
  compileLunchModel(model, learningRate);

  const [seed, seedIndices] = lunchDataObj.getRandomSlice();
  console.log(`Seed lunch places:\n"${seed}"\n`);

  const DISPLAY_TEMPERATURES = [0, 0.25, 0.5, 0.75, 1];

  let epochCount = 0;
  let guess = "";
  return new Observable(async (subscriber) => {
    await fitLunchModel(
      model,
      lunchDataObj,
      epochs,
      examplesPerEpoch,
      batchSize,
      validationSplit,
      {
        onTrainBegin: async () => {
          epochCount++;
          console.log(`Epoch ${epochCount} of ${epochs}:`);
        },
        onTrainEnd: async () => {
          DISPLAY_TEMPERATURES.forEach(async temperature => {
              guess = await generateRestaurant(
                model,
                lunchDataObj,
                seedIndices,
                displayLength,
                temperature
              );
              if (temperature === 1) {
                subscriber.next({guess, epoch: epochCount});
              }
              if (epochCount === epochs) {
                subscriber.complete();
              }
            });
        }
      }
    );
  });
}

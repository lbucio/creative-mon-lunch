import React from 'react';
import { Link } from '@reach/router';

import './navbar.scss';

const Navbar: React.FC = () => {
    return (
        <header className="navbar  container">
            <nav className="navbar__nav">
                <div className="navbar__nav-left">
                    <Link className="navbar__nav-link" to="/">Today</Link>
                </div>
                <div className="navbar__nav-right">
                    <Link className="navbar__nav-link" to="/predictions">Predictions</Link>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;

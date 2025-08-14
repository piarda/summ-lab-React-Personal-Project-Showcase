import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to Sip Happens!</h1>
            <p className={styles.subtitle}>
            The place where wine connoisseurs and sommeliers manage their finest vinos.
            </p>
        </div>
    );
};

export default LandingPage;

  import React from 'react';
  import { Link } from 'react-router-dom';
  const Unauthorized = () => {
    return (

    <div className="page" style={{ textAlign: 'center', marginTop: '30px' }}>

        <h2 style={{ color: '#ef4444' }}>403 - Access Denied</h2>

        <p style={{ marginTop: '10px' }}>
          You do not have permission to view this page.

        </p>
        <br />
        
        <Link to="/dashboard" className="btn">
          Back to Dashboard
        </Link>

      </div>
    );
  };

  export default Unauthorized;

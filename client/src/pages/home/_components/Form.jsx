import React from 'react'

function Form({handleSubmit, streamKey, setStreamKey}) {
  return (
    <div style={styles.container}>
        <h1 style={styles.heading}>Live Stream</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
            <input 
                type="text" 
                value={streamKey} 
                onChange={(e) => setStreamKey(e.target.value)} 
                placeholder="Enter Stream Key" 
                style={styles.input} 
            />
            <button type="submit" style={styles.button}>Submit</button>
        </form>
    </div>
  )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '32px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        marginBottom: '10px',
        border: '2px solid #ddd',
        borderRadius: '5px',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    }
};

export default Form
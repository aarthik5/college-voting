import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/admin/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error('Error fetching candidates:', err.message);
      setMessage('Failed to fetch candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !image) {
      setMessage('All fields required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:4000/api/admin/add-candidate', formData);
      setMessage('✅ Candidate added successfully!');
      setName('');
      setRole('');
      setImage(null);
      fetchCandidates();
    } catch (err) {
      console.error('Error adding candidate:', err.message);
      setMessage('❌ Error adding candidate.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/admin/candidates/${id}`);
      setMessage('🗑️ Candidate deleted.');
      fetchCandidates();
    } catch (err) {
      console.error('Error deleting candidate:', err.message);
      setMessage('❌ Error deleting candidate.');
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const grouped = candidates.reduce((acc, cand) => {
    const roleKey = cand.role.trim().toLowerCase();
    if (!acc[roleKey]) acc[roleKey] = { role: cand.role.trim(), candidates: [] };
    acc[roleKey].candidates.push(cand);
    return acc;
  }, {});

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h2 style={styles.title}>🧑‍💼 Admin Panel – Add Candidate</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={styles.form}>
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>Add Candidate</button>
      </form>
      <p style={styles.message}>{message}</p>

      <hr style={{ margin: '30px 0', borderColor: '#555' }} />
      <h3 style={styles.subtitle}>📊 All Candidates & Votes</h3>

      {Object.values(grouped).map(group => (
        <div key={group.role} style={styles.roleSection}>
          <h2 style={styles.roleTitle}>{group.role}</h2>
          <div style={styles.cardContainer}>
            {group.candidates.map(c => (
              <div key={c._id} style={styles.card}>
                <img
                  src={`http://localhost:4000/${c.image}`}
                  alt={c.name}
                  style={styles.image}
                />
                <p><strong>{c.name}</strong></p>
                <p>{c.votes} vote(s)</p>
                <button onClick={() => handleDelete(c._id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: '40px',
    background: 'linear-gradient(to right, #0D0F23, #2D2D54)',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '26px',
    margin: 0
  },
  logoutBtn: {
    backgroundColor: '#FF4C4C',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    minWidth: '200px'
  },
  addBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  message: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#00FF99'
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  roleSection: {
    marginBottom: '40px'
  },
  roleTitle: {
    fontSize: '22px',
    color: '#9be7ff',
    marginBottom: '16px',
    textTransform: 'capitalize'
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '15px',
    borderRadius: '12px',
    width: '160px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff'
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '10px'
  },
  deleteBtn: {
    padding: '6px 12px',
    background: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    marginTop: '10px',
    cursor: 'pointer'
  }
};

export default AdminPage;
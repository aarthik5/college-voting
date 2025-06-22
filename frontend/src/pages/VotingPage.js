import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [votedRoles, setVotedRoles] = useState({});
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const TOTAL_ROLES = 10;
  const hasFinishedVoting = Object.keys(votedRoles).length >= TOTAL_ROLES;

  const grouped = candidates.reduce((acc, cand) => {
    const roleKey = cand.role.trim().toLowerCase();
    if (!acc[roleKey]) acc[roleKey] = { role: cand.role.trim(), candidates: [] };
    acc[roleKey].candidates.push(cand);
    return acc;
  }, {});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded.id);

      axios.get('http://localhost:4000/api/admin/candidates')
        .then(res => setCandidates(res.data))
        .catch(err => console.error('Error loading candidates', err));

      axios.get(`http://localhost:4000/api/users/${decoded.id}`)
        .then(res => setVotedRoles(res.data.votedRoles || {}))
        .catch(err => console.error('Error loading voted roles', err));
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/');
    }
  }, [navigate]);

  const handleVote = async (candidateId, role) => {
    try {
      const res = await axios.post('http://localhost:4000/api/users/vote', {
        userId,
        candidateId
      });

      setMessage(res.data.message);
      setIsError(false);
      setVotedRoles(prev => ({ ...prev, [role.trim().toLowerCase()]: true }));

      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      setMessage(msg);
      setIsError(true);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>🗳️ SAMCA Voting Portal</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <p style={styles.subtext}>Vote once per role. Already voted roles will be locked.</p>
      <p style={styles.counter}>
        ✅ {Object.keys(votedRoles).length} of {TOTAL_ROLES} roles voted
      </p>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: isError ? '#ff4c4c33' : '#00ff9944',
          borderColor: isError ? '#ff4c4c' : '#00ff99',
          color: isError ? '#ff4c4c' : '#00ff99'
        }}>
          {message}
        </div>
      )}

      {hasFinishedVoting ? (
        <p style={styles.complete}>🎉 You’ve completed voting in all roles. Thank you!</p>
      ) : (
        Object.values(grouped).map(group => {
          const normalizedRole = group.role.trim().toLowerCase();
          const isVoted = votedRoles[normalizedRole];

          return (
            <div key={group.role} style={styles.roleSection}>
              <h2 style={styles.roleTitle}>
                {group.role.charAt(0).toUpperCase() + group.role.slice(1)}
              </h2>
              <div style={styles.cardContainer}>
                {group.candidates.map(c => (
                  <div key={c._id} style={styles.card}>
                    <img
                      src={`http://localhost:4000/${c.image}`}
                      alt={c.name}
                      style={styles.image}
                    />
                    <h4 style={styles.name}>{c.name}</h4>
                    {!isVoted ? (
                      <button style={styles.voteBtn} onClick={() => handleVote(c._id, group.role)}>
                        Vote
                      </button>
                    ) : (
                      <button style={styles.disabledBtn} disabled>
                        Voted
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  page: {
    background: 'linear-gradient(to right, #0D0F23, #2D2D54)',
    minHeight: '100vh',
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#fff',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    margin: 0,
  },
  logoutBtn: {
    backgroundColor: '#FF4C4C',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  subtext: {
    fontSize: '16px',
    opacity: 0.8,
    textAlign: 'center',
  },
  counter: {
    fontWeight: 'bold',
    marginTop: '10px',
    textAlign: 'center',
  },
  complete: {
    textAlign: 'center',
    color: '#00FF99',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  messageBox: {
    padding: '12px',
    border: '1px solid',
    borderRadius: '10px',
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '600px',
    fontWeight: 'bold',
  },
  roleSection: {
    marginBottom: '40px',
  },
  roleTitle: {
    marginBottom: '16px',
    fontSize: '22px',
    color: '#9be7ff',
    textTransform: 'capitalize',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
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
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  name: {
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  voteBtn: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
  disabledBtn: {
    padding: '8px 16px',
    backgroundColor: '#888',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'not-allowed',
  },
};

export default VotingPage;
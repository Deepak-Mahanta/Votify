import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const VoterDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, candidateRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/candidate`)
        ]);

        setProfile(userRes.data.user);
        setCandidates(candidateRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    localStorage.removeItem("token");
    toast.success("✅ Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }
};



  const handleVote = async (candidateID) => {
    try {
      if (!candidateID || candidateID.length !== 24) {
        alert("Invalid Candidate ID");
        return;
      }
 


      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      setVoteLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/candidate/vote/${candidateID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        alert("✅ Vote recorded successfully!");
        setProfile({ ...profile, isVoted: true });
        setCandidates(prev =>
          prev.map(c =>
            c._id === candidateID ? { ...c, voteCount: c.voteCount + 1 } : c
          )
        );
      }
    } catch (err) {
      console.error("Voting error:", err);
      alert(err.response?.data?.message || "Vote failed");
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 px-4">
  <div className="flex flex-col sm:flex-row items-center justify-between relative text-center sm:text-left">
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-0">
        <span className="text-green-600">Voter</span> Dashboard
      </h1>
      <p className="text-gray-500 text-sm sm:text-base">
        Cast your vote securely and transparently
      </p>
    </div>

    <button
      onClick={handleLogout}
      className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
</header>



        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 transition-all hover:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Your Profile
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile?.isVoted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {profile?.isVoted ? 'Voted' : 'Eligible'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{profile?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{profile?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium text-gray-800">{profile?.age}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium text-gray-800">{profile?.mobile}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-medium text-gray-800">{profile?.aadharCardNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Voting Status</p>
                <p className="font-medium">
                  {profile?.isVoted ? (
                    <span className="text-green-600">Vote Submitted</span>
                  ) : (
                    <span className="text-blue-600">Ready to Vote</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              Candidates
            </h2>
            <p className="text-gray-500">{candidates.length} candidates available</p>
          </div>

          {candidates.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No candidates available</h3>
              <p className="text-gray-500">Check back later for candidate announcements</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={candidate.photoUrl || "/default-candidate.jpg"}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-candidate.jpg";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                      <p className="text-green-300 font-medium">{candidate.party}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{candidate.age} years</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-600">{candidate.voteCount || 0} votes</span>
                      </div>
                    </div>
                    
                    {profile?.isVoted ? (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        You've cast your vote
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVote(candidate._id)}
                        disabled={voteLoading}
                        className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                          voteLoading
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {voteLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Vote Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />

    </div>
  );
};

export default VoterDashboard;
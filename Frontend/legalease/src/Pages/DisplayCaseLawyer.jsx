import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { PropagateLoader } from "react-spinners";

const DisplayCaseLawyer = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const verifyRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verifyLawyer`,
          {
            withCredentials: true,
          },
        );

        if (verifyRes.data.status) {
          console.log("Verification Success!");
          try {
            const casesRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/cases/getLawyerCase`,
              {
                withCredentials: true,
              },
            );

            if (casesRes.data.status) {
              console.log("Lawyer Cases Fetched");
              setCases(casesRes.data.cases);
            } else {
              setError("No cases found");
            }
          } catch (error) {
            console.error("Error fetching cases:", error);
            setError("Failed to fetch cases");
          }
        } else {
          setError("Authentication failed. Please sign in again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("Authentication verification failed");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { class: "status-pending", text: "Pending" },
      "In Progress": { class: "status-progress", text: "In Progress" },
      Completed: { class: "status-completed", text: "Completed" },
      Rejected: { class: "status-rejected", text: "Rejected" },
    };

    const config = statusConfig[status] || null;
    return config ? (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    ) : null;
  };

  const handleSignOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lawyerAuth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/lawyerSignin");
    }
  };

  // File download
  const downloadFile = (fileData, fileName, fileType) => {
    if (!fileData) return;

    const base64Data = fileData.startsWith("data:")
      ? fileData
      : `data:${fileType};base64,${fileData}`;

    fetch(base64Data)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "case-file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.error("Download error:", err);
        setError("Failed to download file");
      });
  };

  const openCaseDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeCaseDetails = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  if (loading) {
    return (
      <div className="cases-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-balance-scale"></i>
              <span>Justice Partners</span>
            </div>
            <nav className="dashboard-nav">
              <button
                className="nav-item"
                onClick={() => navigate("/lawyerPage")}
              >
                Dashboard
              </button>
              <button className="nav-item active">My Cases</button>
              <Link to={"/displayAvailability"}>
                {" "}
                <button className="nav-item">Availability</button>
              </Link>
            </nav>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <main className="cases-main-content">
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-animation">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-center"></div>
                </div>
                <div className="loading-text">
                  <h2>Loading Your Legal Cases</h2>
                  <p>Fetching your assigned cases from our database...</p>
                </div>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Loading case details</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .cases-container {
            min-height: 100vh;
            background-color: #f8f9fa;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }

          .dashboard-header {
            background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
            color: white;
            padding: 0.6rem 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }

          .logo {
            display: flex;
            align-items: center;
            font-size: 1.2rem;
            font-weight: bold;
          }

          .logo i {
            margin-right: 0.4rem;
            font-size: 1.5rem;
          }

          .dashboard-nav {
            display: flex;
            gap: 1.2rem;
          }

          .nav-item {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            padding: 0.3rem 0;
            font-size: 0.9rem;
            position: relative;
            transition: color 0.3s;
          }

          .nav-item:hover,
          .nav-item.active {
            color: white;
          }

          .nav-item.active::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: white;
          }

          .sign-out-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.9rem;
            transition: all 0.3s;
          }

          .sign-out-btn:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .cases-main-content {
            max-width: 1400px;
            margin: 1.5rem auto;
            padding: 0 1.5rem;
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 300px;
          }

          .loading-content {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .loading-animation {
            background: white;
            padding: 2rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .loading-spinner {
            position: relative;
            width: 60px;
            height: 60px;
            margin: 0 auto 1.5rem;
          }

          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top: 2px solid #2c3e50;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
          }

          .spinner-ring:nth-child(1) {
            animation-delay: 0s;
            border-top-color: #2c3e50;
          }

          .spinner-ring:nth-child(2) {
            animation-delay: 0.5s;
            border-top-color: #4a6580;
            width: 70%;
            height: 70%;
            top: 15%;
            left: 15%;
          }

          .spinner-ring:nth-child(3) {
            animation-delay: 1s;
            border-top-color: #3498db;
            width: 50%;
            height: 50%;
            top: 25%;
            left: 25%;
          }

          .spinner-center {
            position: absolute;
            width: 15px;
            height: 15px;
            background: #2c3e50;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .loading-text h2 {
            color: #2c3e50;
            margin-bottom: 0.4rem;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .loading-text p {
            color: #7b8a9b;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }

          .loading-progress {
            margin-top: 1.5rem;
          }

          .progress-bar {
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 0.4rem;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #2c3e50, #4a6580);
            border-radius: 2px;
            animation: progress 2s ease-in-out infinite;
          }

          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .progress-text {
            color: #6c757d;
            font-size: 0.8rem;
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 0.8rem;
            }

            .dashboard-nav {
              order: 3;
              overflow-x: auto;
              width: 100%;
              padding-bottom: 0.3rem;
              justify-content: center;
            }

            .loading-animation {
              padding: 1.5rem 1rem;
            }

            .loading-text h2 {
              font-size: 1.1rem;
            }

            .loading-spinner {
              width: 50px;
              height: 50px;
            }
          }
        `}</style>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cases-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-balance-scale"></i>
              <span>Justice Partners</span>
            </div>
            <nav className="dashboard-nav">
              <button
                className="nav-item"
                onClick={() => navigate("/lawyerPage")}
              >
                Dashboard
              </button>
              <button className="nav-item active">My Cases</button>
              <Link to={"/displayAvailability"}>
                {" "}
                <button className="nav-item">Availability</button>
              </Link>
            </nav>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <main className="cases-main-content">
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h2>Error Loading Cases</h2>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo"></i> Try Again
              </button>
            </div>
          </div>
        </main>

        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 300px;
          }

          .error-content {
            text-align: center;
            background: white;
            padding: 2rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
          }

          .error-icon {
            font-size: 3rem;
            color: #e74c3c;
            margin-bottom: 1rem;
          }

          .error-content h2 {
            color: #2c3e50;
            margin-bottom: 0.8rem;
            font-size: 1.4rem;
          }

          .error-content p {
            color: #7b8a9b;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .retry-btn {
            background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
            color: white;
            border: none;
            padding: 0.7rem 1.5rem;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
          }

          .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(44, 62, 80, 0.25);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cases-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button
              className="nav-item"
              onClick={() => navigate("/lawyerPage")}
            >
              Dashboard
            </button>
            <button className="nav-item active">My Cases</button>
            <Link to={"/displayAvailability"}>
              {" "}
              <button className="nav-item">Availability</button>
            </Link>
          </nav>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="cases-main-content">
        <div className="cases-header">
          <h1>My Legal Cases</h1>
          <p>Manage your assigned cases</p>
          <div className="cases-stats">
            <div className="stat-card">
              <div className="stat-icon total">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{cases.length}</span>
                <span className="stat-label">Total Cases</span>
              </div>
            </div>
          </div>
        </div>
        {cases.length === 0 ? (
          <div className="no-cases-container">
            <div className="no-cases-content">
              <div className="no-cases-illustration">
                <i className="fas fa-folder-open"></i>
                <div className="illustration-circle"></div>
                <div className="illustration-circle circle-2"></div>
              </div>
              <div className="no-cases-text">
                <h2>No Cases Assigned</h2>
                <p>
                  You haven't been assigned any legal cases yet. New cases will
                  appear here once assigned.
                </p>
                <div className="no-cases-tips">
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Complete your profile verification</span>
                  </div>
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Keep your availability updated</span>
                  </div>
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Check back regularly</span>
                  </div>
                </div>
                <div className="no-cases-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => navigate("/lawyerPage")}
                  >
                    <i className="fas fa-home"></i> Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cases-grid">
            {cases.map((caseItem, index) => (
              <div key={caseItem._id || index} className="case-card">
                <div className="case-header">
                  <h3>{caseItem.caseTitle}</h3>
                  {getStatusBadge(caseItem.status)}
                </div>

                <div className="case-type">
                  <i className="fas fa-tag"></i>
                  <span>{caseItem.caseType}</span>
                </div>

                <div className="case-description">
                  <p>{caseItem.caseDiscription}</p>
                </div>

                {/* Compact File Section */}
                {caseItem.caseFile && (
                  <div className="compact-file-section">
                    <div className="file-info">
                      <i className="fas fa-file-pdf"></i>
                      <div className="file-details">
                        <span className="file-name">Case Document</span>
                      </div>
                    </div>
                    <button
                      className="compact-download-btn"
                      onClick={() =>
                        downloadFile(
                          caseItem.caseFile,
                          `${caseItem.caseTitle || "case-file"}.pdf`,
                          "application/pdf",
                        )
                      }
                      title="Download file"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                )}

                <div className="case-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <div className="detail-content">
                        <span className="detail-label">Client</span>
                        <span className="detail-value">
                          {caseItem.client?.firstName || "N/A"}{" "}
                          {caseItem.client?.lastName || ""}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <div className="detail-content">
                        <span className="detail-label">Created</span>
                        <span className="detail-value">
                          {formatDate(caseItem.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <div className="detail-content">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">
                          {caseItem.client?.email || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <div className="detail-content">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">
                          {caseItem.client?.phoneNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {caseItem.appointmentTime && (
                    <div className="detail-item full-width">
                      <i className="fas fa-clock"></i>
                      <div className="detail-content">
                        <span className="detail-label">Appointment</span>
                        <span className="detail-value">
                          {caseItem.appointmentTime.availableDate
                            ? formatDate(caseItem.appointmentTime.availableDate)
                            : "Scheduled"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="case-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => openCaseDetails(caseItem)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Case Details Modal */}
      {isModalOpen && selectedCase && (
        <div className="modal-overlay" onClick={closeCaseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCase.caseTitle}</h2>
              <button className="modal-close-btn" onClick={closeCaseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Case Info</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Type</span>
                    <span className="modal-detail-value">
                      {selectedCase.caseType}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Status</span>
                    <span className="modal-detail-value">
                      {getStatusBadge(selectedCase.status)}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Created</span>
                    <span className="modal-detail-value">
                      {formatDate(selectedCase.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Description</h3>
                <p className="modal-description">
                  {selectedCase.caseDiscription}
                </p>
              </div>

              <div className="modal-section">
                <h3>Client Info</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Name</span>
                    <span className="modal-detail-value">
                      {selectedCase.client?.firstName || "N/A"}{" "}
                      {selectedCase.client?.lastName || ""}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Email</span>
                    <span className="modal-detail-value">
                      {selectedCase.client?.email || "N/A"}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Phone</span>
                    <span className="modal-detail-value">
                      {selectedCase.client?.phoneNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedCase.caseFile && (
                <div className="modal-section">
                  <h3>Documents</h3>
                  <div className="modal-file-section">
                    <div className="modal-file-info">
                      <i className="fas fa-file-pdf"></i>
                      <div className="modal-file-details">
                        <span className="modal-file-name">
                          Case Document.pdf
                        </span>
                      </div>
                    </div>
                    <button
                      className="modal-download-btn"
                      onClick={() =>
                        downloadFile(
                          selectedCase.caseFile,
                          `${selectedCase.caseTitle || "case-file"}.pdf`,
                          "application/pdf",
                        )
                      }
                    >
                      <i className="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-close-button" onClick={closeCaseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cases-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          padding: 0.6rem 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .logo i {
          margin-right: 0.4rem;
          font-size: 1.5rem;
        }

        .dashboard-nav {
          display: flex;
          gap: 1.2rem;
        }

        .nav-item {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          padding: 0.3rem 0;
          font-size: 0.9rem;
          position: relative;
          transition: color 0.3s;
        }

        .nav-item:hover,
        .nav-item.active {
          color: white;
        }

        .nav-item.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: white;
        }

        .sign-out-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .sign-out-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .cases-main-content {
          max-width: 1400px;
          margin: 1.5rem auto;
          padding: 0 1.5rem;
        }

        .cases-header {
          background: white;
          border-radius: 8px;
          padding: 1.2rem 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .cases-header h1 {
          color: #2c3e50;
          margin-bottom: 0.2rem;
          font-size: 1.6rem;
        }

        .cases-header p {
          color: #7b8a9b;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .cases-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 1px solid #e9ecef;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 45px;
          height: 45px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .stat-icon.total {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.2rem;
        }

        .case-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s;
          border: 1px solid #e9ecef;
        }

        .case-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .case-header {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .case-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          flex: 1;
          margin-right: 0.8rem;
        }

        .status-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 700;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-progress {
          background-color: #cce5ff;
          color: #004085;
        }

        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }

        .status-rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .case-type {
          padding: 0.4rem 1.2rem;
          background-color: #f0f4f8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a6580;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .case-description {
          padding: 0.8rem 1.2rem;
          border-bottom: 1px solid #e9ecef;
        }

        .case-description p {
          color: #5a6c7d;
          margin: 0;
          line-height: 1.4;
          font-size: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Compact File Section */
        .compact-file-section {
          padding: 0.6rem 1.2rem;
          border-top: 1px solid #e9ecef;
          background: #fafbfc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
        }

        .file-info i {
          color: #e74c3c;
          font-size: 1.2rem;
        }

        .file-details {
          display: flex;
          flex-direction: column;
        }

        .file-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.85rem;
        }

        .compact-download-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .compact-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(44, 62, 80, 0.3);
        }

        .case-details {
          padding: 1rem 1.2rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.8rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }

        .detail-item.full-width {
          flex: 0 0 100%;
          margin-top: 0.3rem;
        }

        .detail-item i {
          color: #4a6580;
          font-size: 0.9rem;
          margin-top: 0.2rem;
          min-width: 16px;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .detail-label {
          font-size: 0.65rem;
          color: #6c757d;
          margin-bottom: 0.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .detail-value {
          font-size: 0.8rem;
          color: #2c3e50;
          font-weight: 500;
          word-wrap: break-word;
          line-height: 1.3;
        }

        .case-actions {
          padding: 0.8rem;
          border-top: 1px solid #e9ecef;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          display: flex;
          justify-content: center;
        }

        .action-btn {
          padding: 0.4rem 1rem;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          transition: all 0.2s;
          width: auto;
          min-width: 90px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .view-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          box-shadow: 0 2px 8px rgba(44, 62, 80, 0.2);
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 62, 80, 0.25);
        }

        /* No Cases Container */
        .no-cases-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .no-cases-content {
          background: white;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 500px;
          width: 100%;
        }

        .no-cases-illustration i {
          font-size: 3.5rem;
          color: #bdc3c7;
          margin-bottom: 1rem;
        }

        .no-cases-text h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .no-cases-text p {
          color: #7b8a9b;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .no-cases-tips {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          text-align: left;
        }

        .tip-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.6rem;
          font-size: 0.85rem;
        }

        .tip-item:last-child {
          margin-bottom: 0;
        }

        .tip-item i {
          color: #27ae60;
          font-size: 0.9rem;
        }

        .tip-item span {
          color: #5a6c7d;
        }

        .no-cases-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-header h2 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.3rem;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover {
          background-color: #f8f9fa;
        }

        .modal-body {
          padding: 1.2rem;
          flex: 1;
        }

        .modal-section {
          margin-bottom: 1.5rem;
        }

        .modal-section h3 {
          color: #2c3e50;
          margin-bottom: 0.8rem;
          font-size: 1rem;
          padding-bottom: 0.3rem;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .modal-detail-item {
          display: flex;
          flex-direction: column;
        }

        .modal-detail-label {
          font-size: 0.7rem;
          color: #6c757d;
          margin-bottom: 0.2rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .modal-detail-value {
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .modal-description {
          color: #5a6c7d;
          line-height: 1.5;
          font-size: 0.9rem;
          margin: 0;
        }

        .modal-file-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .modal-file-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .modal-file-info i {
          color: #e74c3c;
          font-size: 2rem;
        }

        .modal-file-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .modal-download-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .modal-footer {
          padding: 1rem 1.2rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: sticky;
          bottom: 0;
        }

        .modal-close-button {
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 0.6rem;
          }

          .cases-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .cases-main-content {
            padding: 0 1rem;
          }

          .cases-header {
            padding: 1rem;
          }

          .cases-header h1 {
            font-size: 1.4rem;
          }

          .no-cases-content {
            padding: 1.5rem;
          }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
    </div>
  );
};

export default DisplayCaseLawyer;

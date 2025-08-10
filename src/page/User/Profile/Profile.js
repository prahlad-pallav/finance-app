import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ onBack }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    avatar: null,
    dateOfBirth: '1990-05-15',
    gender: 'male',
    location: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    bio: 'Passionate about personal finance and investment strategies. Always looking to learn and grow my financial knowledge.',
    preferences: {
      currency: 'INR',
      language: 'English',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false
      }
    },
    stats: {
      joinDate: '2023-01-15',
      lastActive: '2024-01-20',
      totalLogins: 156,
      favoriteCalculators: ['SIP Calculator', 'Compound Interest Calculator'],
      watchlistItems: 12,
      savedArticles: 8
    },
    financialGoals: [
      {
        id: 1,
        title: 'Emergency Fund',
        target: 500000,
        current: 350000,
        deadline: '2024-06-30',
        status: 'in-progress'
      },
      {
        id: 2,
        title: 'Home Down Payment',
        target: 2000000,
        current: 800000,
        deadline: '2025-12-31',
        status: 'in-progress'
      },
      {
        id: 3,
        title: 'Retirement Fund',
        target: 10000000,
        current: 2500000,
        deadline: '2040-01-01',
        status: 'in-progress'
      }
    ],
    investmentPortfolio: {
      totalValue: 4500000,
      totalGain: 850000,
      gainPercentage: 23.3,
      assets: [
        { type: 'Stocks', value: 2500000, percentage: 55.6 },
        { type: 'Mutual Funds', value: 1200000, percentage: 26.7 },
        { type: 'Fixed Deposits', value: 500000, percentage: 11.1 },
        { type: 'Gold', value: 300000, percentage: 6.7 }
      ]
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditForm(user);
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGoalProgress = (goal) => {
    return (goal.current / goal.target) * 100;
  };

  const getGoalStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#2196f3';
      case 'behind': return '#ff9800';
      case 'overdue': return '#f44336';
      default: return '#666';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const renderOverview = () => (
    <div className="Profile__Overview">
      <div className="Profile__StatsGrid">
        <div className="Profile__StatCard">
          <div className="Profile__StatIcon">📈</div>
          <div className="Profile__StatContent">
            <h3>{formatCurrency(user.investmentPortfolio.totalValue)}</h3>
            <p>Portfolio Value</p>
            <span className={`Profile__StatChange ${user.investmentPortfolio.gainPercentage >= 0 ? 'positive' : 'negative'}`}>
              {user.investmentPortfolio.gainPercentage >= 0 ? '+' : ''}{user.investmentPortfolio.gainPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="Profile__StatCard">
          <div className="Profile__StatIcon">🎯</div>
          <div className="Profile__StatContent">
            <h3>{user.financialGoals.length}</h3>
            <p>Active Goals</p>
            <span className="Profile__StatSubtext">
              {user.financialGoals.filter(g => g.status === 'completed').length} completed
            </span>
          </div>
        </div>

        <div className="Profile__StatCard">
          <div className="Profile__StatIcon">📊</div>
          <div className="Profile__StatContent">
            <h3>{user.stats.watchlistItems}</h3>
            <p>Watchlist Items</p>
            <span className="Profile__StatSubtext">Stocks & Crypto</span>
          </div>
        </div>

        <div className="Profile__StatCard">
          <div className="Profile__StatIcon">📚</div>
          <div className="Profile__StatContent">
            <h3>{user.stats.savedArticles}</h3>
            <p>Saved Articles</p>
            <span className="Profile__StatSubtext">Learning resources</span>
          </div>
        </div>
      </div>

      <div className="Profile__PortfolioSection">
        <h3>Portfolio Allocation</h3>
        <div className="Profile__PortfolioChart">
          {user.investmentPortfolio.assets.map((asset, index) => (
            <div key={asset.type} className="Profile__PortfolioAsset">
              <div className="Profile__PortfolioBar">
                <div 
                  className="Profile__PortfolioBarFill"
                  style={{ 
                    width: `${asset.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                  }}
                ></div>
              </div>
              <div className="Profile__PortfolioAssetInfo">
                <span className="Profile__PortfolioAssetName">{asset.type}</span>
                <span className="Profile__PortfolioAssetValue">{formatCurrency(asset.value)}</span>
                <span className="Profile__PortfolioAssetPercentage">{asset.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="Profile__RecentActivity">
        <h3>Recent Activity</h3>
        <div className="Profile__ActivityList">
          <div className="Profile__ActivityItem">
            <div className="Profile__ActivityIcon">📊</div>
            <div className="Profile__ActivityContent">
              <p>Updated portfolio value</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className="Profile__ActivityItem">
            <div className="Profile__ActivityIcon">🎯</div>
            <div className="Profile__ActivityContent">
              <p>Added new financial goal</p>
              <span>1 day ago</span>
            </div>
          </div>
          <div className="Profile__ActivityItem">
            <div className="Profile__ActivityIcon">📈</div>
            <div className="Profile__ActivityContent">
              <p>Used SIP Calculator</p>
              <span>3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="Profile__PersonalInfo">
      <div className="Profile__AvatarSection">
        <div className="Profile__Avatar">
          {editForm.avatar ? (
            <img src={editForm.avatar} alt="Profile" />
          ) : (
            <div className="Profile__AvatarPlaceholder">
              {editForm.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isEditing && (
            <label className="Profile__AvatarUpload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
              📷
            </label>
          )}
        </div>
      </div>

      <div className="Profile__FormGrid">
        <div className="Profile__FormGroup">
          <label>Full Name</label>
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Email</label>
          <input
            type="email"
            value={editForm.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Phone</label>
          <input
            type="tel"
            value={editForm.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Date of Birth</label>
          <input
            type="date"
            value={editForm.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Gender</label>
          <select
            value={editForm.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="Profile__FormGroup">
          <label>Location</label>
          <input
            type="text"
            value={editForm.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Occupation</label>
          <input
            type="text"
            value={editForm.occupation || ''}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup">
          <label>Company</label>
          <input
            type="text"
            value={editForm.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="Profile__FormGroup Profile__FormGroup--full">
          <label>Bio</label>
          <textarea
            value={editForm.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="Profile__Financial">
      <div className="Profile__FinancialOverview">
        <div className="Profile__FinancialCard">
          <h3>Portfolio Summary</h3>
          <div className="Profile__FinancialStats">
            <div className="Profile__FinancialStat">
              <span className="Profile__FinancialLabel">Total Value</span>
              <span className="Profile__FinancialValue">{formatCurrency(user.investmentPortfolio.totalValue)}</span>
            </div>
            <div className="Profile__FinancialStat">
              <span className="Profile__FinancialLabel">Total Gain</span>
              <span className={`Profile__FinancialValue ${user.investmentPortfolio.gainPercentage >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(user.investmentPortfolio.totalGain)}
              </span>
            </div>
            <div className="Profile__FinancialStat">
              <span className="Profile__FinancialLabel">Gain %</span>
              <span className={`Profile__FinancialValue ${user.investmentPortfolio.gainPercentage >= 0 ? 'positive' : 'negative'}`}>
                {user.investmentPortfolio.gainPercentage >= 0 ? '+' : ''}{user.investmentPortfolio.gainPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="Profile__AssetAllocation">
        <h3>Asset Allocation</h3>
        <div className="Profile__AssetGrid">
          {user.investmentPortfolio.assets.map((asset, index) => (
            <div key={asset.type} className="Profile__AssetCard">
              <div className="Profile__AssetHeader">
                <div className="Profile__AssetIcon" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}>
                  {asset.type.charAt(0)}
                </div>
                <div className="Profile__AssetInfo">
                  <h4>{asset.type}</h4>
                  <p>{asset.percentage}% of portfolio</p>
                </div>
              </div>
              <div className="Profile__AssetValue">
                {formatCurrency(asset.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="Profile__Goals">
      <div className="Profile__GoalsHeader">
        <h3>Financial Goals</h3>
        <button className="Profile__AddGoalBtn">+ Add Goal</button>
      </div>

      <div className="Profile__GoalsGrid">
        {user.financialGoals.map(goal => (
          <div key={goal.id} className="Profile__GoalCard">
            <div className="Profile__GoalHeader">
              <h4>{goal.title}</h4>
              <span 
                className="Profile__GoalStatus"
                style={{ backgroundColor: getGoalStatusColor(goal.status) }}
              >
                {goal.status.replace('-', ' ')}
              </span>
            </div>
            
            <div className="Profile__GoalProgress">
              <div className="Profile__GoalProgressBar">
                <div 
                  className="Profile__GoalProgressFill"
                  style={{ width: `${getGoalProgress(goal)}%` }}
                ></div>
              </div>
              <div className="Profile__GoalProgressText">
                {getGoalProgress(goal).toFixed(1)}% complete
              </div>
            </div>

            <div className="Profile__GoalDetails">
              <div className="Profile__GoalAmount">
                <span className="Profile__GoalCurrent">{formatCurrency(goal.current)}</span>
                <span className="Profile__GoalTarget">/ {formatCurrency(goal.target)}</span>
              </div>
              <div className="Profile__GoalDeadline">
                Due: {formatDate(goal.deadline)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="Profile__Preferences">
      <div className="Profile__PreferenceSection">
        <h3>General Preferences</h3>
        <div className="Profile__PreferenceGrid">
          <div className="Profile__PreferenceItem">
            <label>Default Currency</label>
            <select
              value={editForm.preferences?.currency || 'INR'}
              onChange={(e) => handlePreferenceChange('currency', 'currency', e.target.value)}
              disabled={!isEditing}
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div className="Profile__PreferenceItem">
            <label>Language</label>
            <select
              value={editForm.preferences?.language || 'English'}
              onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
              disabled={!isEditing}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="Profile__PreferenceSection">
        <h3>Notifications</h3>
        <div className="Profile__NotificationSettings">
          <div className="Profile__NotificationItem">
            <div className="Profile__NotificationInfo">
              <label>Email Notifications</label>
              <p>Receive updates and alerts via email</p>
            </div>
            <label className="Profile__Toggle">
              <input
                type="checkbox"
                checked={editForm.preferences?.notifications?.email || false}
                onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                disabled={!isEditing}
              />
              <span className="Profile__ToggleSlider"></span>
            </label>
          </div>

          <div className="Profile__NotificationItem">
            <div className="Profile__NotificationInfo">
              <label>Push Notifications</label>
              <p>Receive real-time alerts on your device</p>
            </div>
            <label className="Profile__Toggle">
              <input
                type="checkbox"
                checked={editForm.preferences?.notifications?.push || false}
                onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                disabled={!isEditing}
              />
              <span className="Profile__ToggleSlider"></span>
            </label>
          </div>

          <div className="Profile__NotificationItem">
            <div className="Profile__NotificationInfo">
              <label>SMS Notifications</label>
              <p>Receive important alerts via SMS</p>
            </div>
            <label className="Profile__Toggle">
              <input
                type="checkbox"
                checked={editForm.preferences?.notifications?.sms || false}
                onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                disabled={!isEditing}
              />
              <span className="Profile__ToggleSlider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="Profile__PreferenceSection">
        <h3>Privacy Settings</h3>
        <div className="Profile__PrivacySettings">
          <div className="Profile__PrivacyItem">
            <div className="Profile__PrivacyInfo">
              <label>Profile Visibility</label>
              <p>Control who can see your profile</p>
            </div>
            <select
              value={editForm.preferences?.privacy?.profileVisibility || 'public'}
              onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
              disabled={!isEditing}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="Profile__PrivacyItem">
            <div className="Profile__PrivacyInfo">
              <label>Show Email</label>
              <p>Allow others to see your email address</p>
            </div>
            <label className="Profile__Toggle">
              <input
                type="checkbox"
                checked={editForm.preferences?.privacy?.showEmail || false}
                onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                disabled={!isEditing}
              />
              <span className="Profile__ToggleSlider"></span>
            </label>
          </div>

          <div className="Profile__PrivacyItem">
            <div className="Profile__PrivacyInfo">
              <label>Show Phone</label>
              <p>Allow others to see your phone number</p>
            </div>
            <label className="Profile__Toggle">
              <input
                type="checkbox"
                checked={editForm.preferences?.privacy?.showPhone || false}
                onChange={(e) => handlePreferenceChange('privacy', 'showPhone', e.target.checked)}
                disabled={!isEditing}
              />
              <span className="Profile__ToggleSlider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="Profile__Security">
      <div className="Profile__SecuritySection">
        <h3>Account Security</h3>
        
        <div className="Profile__SecurityItem">
          <div className="Profile__SecurityInfo">
            <h4>Password</h4>
            <p>Last changed: {formatDate('2023-12-15')}</p>
          </div>
          <button className="Profile__SecurityBtn">Change Password</button>
        </div>

        <div className="Profile__SecurityItem">
          <div className="Profile__SecurityInfo">
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button className="Profile__SecurityBtn">Enable 2FA</button>
        </div>

        <div className="Profile__SecurityItem">
          <div className="Profile__SecurityInfo">
            <h4>Login History</h4>
            <p>View recent login activity</p>
          </div>
          <button className="Profile__SecurityBtn">View History</button>
        </div>
      </div>

      <div className="Profile__SecuritySection">
        <h3>Data & Privacy</h3>
        
        <div className="Profile__SecurityItem">
          <div className="Profile__SecurityInfo">
            <h4>Download Data</h4>
            <p>Get a copy of your personal data</p>
          </div>
          <button className="Profile__SecurityBtn">Download</button>
        </div>

        <div className="Profile__SecurityItem">
          <div className="Profile__SecurityInfo">
            <h4>Delete Account</h4>
            <p>Permanently delete your account and data</p>
          </div>
          <button className="Profile__SecurityBtn Profile__SecurityBtn--danger">Delete Account</button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'personal':
        return renderPersonalInfo();
      case 'financial':
        return renderFinancial();
      case 'goals':
        return renderGoals();
      case 'preferences':
        return renderPreferences();
      case 'security':
        return renderSecurity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="Profile">
      <div className="Profile__Container">
        {/* Header */}
        <div className="Profile__Header">
          <button className="Profile__BackButton" onClick={onBack}>← Back</button>
          <div className="Profile__HeaderContent">
            <h1 className="Profile__Title">Profile</h1>
            <p className="Profile__Subtitle">Manage your account settings and preferences</p>
          </div>
          <div className="Profile__HeaderActions">
            {isEditing ? (
              <>
                <button 
                  className="Profile__SaveBtn"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="Profile__CancelBtn"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className="Profile__EditBtn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="Profile__Info">
          <div className="Profile__AvatarLarge">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" />
            ) : (
              <div className="Profile__AvatarLargePlaceholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="Profile__UserInfo">
            <h2 className="Profile__UserName">{user.name}</h2>
            <p className="Profile__UserEmail">{user.email}</p>
            <p className="Profile__UserLocation">{user.location}</p>
            <p className="Profile__UserJoinDate">Member since {formatDate(user.stats.joinDate)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="Profile__Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`Profile__Tab ${activeTab === tab.id ? 'Profile__Tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="Profile__TabIcon">{tab.icon}</span>
              <span className="Profile__TabLabel">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="Profile__Content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;

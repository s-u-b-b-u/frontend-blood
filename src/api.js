const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  async getMe(token) {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  async getOrganizations(token) {
    const response = await fetch(`${API_URL}/organizations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch organizations');
    return response.json();
  },

  async getOrganizationById(token, id) {
    const response = await fetch(`${API_URL}/organizations/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to fetch organization details';
      if (error.detail) errMsg = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      throw new Error(errMsg);
    }
    return response.json();
  },

  async updateOrganization(token, id, orgData) {
    const response = await fetch(`${API_URL}/organizations/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orgData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to update organization';
      if (error.detail) errMsg = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      throw new Error(errMsg);
    }
    return response.json();
  },

  async getAuditLogs(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/audit_logs?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
  },

  async getUsers(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/users?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getUserById(token, id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getBloodGroups() {
    const response = await fetch(`${API_URL}/reference/blood-groups`);
    if (!response.ok) throw new Error('Failed to fetch blood groups');
    return response.json();
  },

  async getDonorProfile(token) {
    const response = await fetch(`${API_URL}/donors/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch donor profile');
    return response.json();
  },

  async updateDonorProfile(token, profileData) {
    const response = await fetch(`${API_URL}/donors/me`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async getMyDonations(token, donorId) {
    let url = `${API_URL}/donations`;
    if (donorId) {
      url += `?donor_id=${donorId}`;
    }
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch donations');
    return response.json();
  },

  async getNotifications(token) {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async getUnreadNotificationCount(token) {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return response.json();
  },

  async markNotificationRead(token, id) {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to mark read');
    return response.json();
  },

  async markAllNotificationsRead(token) {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to mark all read');
    return response.json();
  },

  async getInventorySummary(token) {
    const response = await fetch(`${API_URL}/inventory/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch inventory summary');
    return response.json();
  },

  async getBloodRequests(token) {
    const response = await fetch(`${API_URL}/blood_requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch blood requests');
    return response.json();
  },

  async getBloodComponents() {
    const response = await fetch(`${API_URL}/reference/blood-components`);
    if (!response.ok) throw new Error('Failed to fetch blood components');
    return response.json();
  },

  async createBloodRequest(token, requestData) {
    const response = await fetch(`${API_URL}/blood_requests`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to create blood request';
      if (Array.isArray(error.detail)) {
        errMsg = error.detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | ');
      } else if (typeof error.detail === 'string') {
        errMsg = error.detail;
      }
      throw new Error(errMsg);
    }
    return response.json();
  },

  async updateBloodRequestStatus(token, id, status) {
    const response = await fetch(`${API_URL}/blood_requests/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update request status');
    return response.json();
  },

  async getNearbyInventory(token, params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/geolocation/compatible-inventory?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to search nearby inventory');
    return response.json();
  },

  async getTransfers(token) {
    const response = await fetch(`${API_URL}/transfers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch transfers');
    return response.json();
  },

  async receiveTransfer(token, transferId) {
    const response = await fetch(`${API_URL}/transfers/${transferId}/receive`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to receive transfer');
    return response.json();
  },

  async getBloodUnits(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/blood_units?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch blood units');
    return response.json();
  },

  async updateBloodUnitStatus(token, id, status) {
    const response = await fetch(`${API_URL}/blood_units/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update blood unit status');
    return response.json();
  },

  async createDonation(token, donationData) {
    const response = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to create donation';
      if (Array.isArray(error.detail)) {
        errMsg = error.detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | ');
      } else if (typeof error.detail === 'string') {
        errMsg = error.detail;
      }
      throw new Error(errMsg);
    }
    return response.json();
  },

  async getDonations(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/donations?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch donations');
    return response.json();
  },

  async updateDonationStatus(token, id, statusData) {
    const response = await fetch(`${API_URL}/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to update donation status';
      if (error.detail) {
        errMsg = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      }
      throw new Error(errMsg);
    }
    return response.json();
  },

  async createTransfer(token, transferData) {
    const response = await fetch(`${API_URL}/transfers`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to create transfer';
      if (Array.isArray(error.detail)) {
        errMsg = error.detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | ');
      } else if (typeof error.detail === 'string') {
        errMsg = error.detail;
      }
      throw new Error(errMsg);
    }
    return response.json();
  },

  async dispatchTransfer(token, id) {
    const response = await fetch(`${API_URL}/transfers/${id}/dispatch`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to dispatch transfer');
    return response.json();
  },

  async cancelTransfer(token, id) {
    const response = await fetch(`${API_URL}/transfers/${id}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to cancel transfer');
    return response.json();
  },

  async findMatches(token, criteria) {
    const response = await fetch(`${API_URL}/matching/find-matches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(criteria)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to find blood matches';
      if (error.detail) errMsg = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      throw new Error(errMsg);
    }
    return response.json();
  },

  async getMatchesForRequest(token, requestId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/matching/request/${requestId}?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Failed to fetch matches for request';
      if (error.detail) errMsg = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      throw new Error(errMsg);
    }
    return response.json();
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      let errMsg = 'Registration failed';
      if (Array.isArray(error.detail)) {
        // FastAPI Pydantic validation errors
        errMsg = error.detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | ');
      } else if (typeof error.detail === 'string') {
        errMsg = error.detail;
      }
      throw new Error(errMsg);
    }
    return response.json();
  }
};

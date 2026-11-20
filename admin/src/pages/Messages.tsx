import React, { useEffect, useState } from 'react';
import { useContactStore } from '@/stores/useContactStore';
import { Trash2, Mail, MailOpen, Eye, Search, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ContactMessage } from '@/types/api';

const AdminContacts = () => {
  const message = useContactStore((s) => s.message);
  const loading = useContactStore((s) => s.loading);
  const error = useContactStore((s) => s.error);
  const fetchMessages = useContactStore((s) => s.fetchMessages);
  const deleteMessage = useContactStore((s) => s.deleteMessage);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ContactMessage; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (error) toast.error(error, { position: 'top-center' });
  }, [error]);

  useEffect(() => {
    fetchMessages();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const handleSort = (key: keyof ContactMessage) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMessages = [...message].sort((a, b) => {
    const av = String(a[sortConfig.key] ?? '');
    const bv = String(b[sortConfig.key] ?? '');
    if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
    if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredMessages = sortedMessages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isMobile 
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 p-4 md:p-6 max-w-6xl mx-auto min-h-screen">
      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Message Details</h2>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">From</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.name}</p>
                </div>
                
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.email}</p>
                </div>
                
                {selectedMessage.subject && (
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">Subject</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500">Message</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-black">Confirm Deletion</h2>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              
              <p className="mb-4 md:mb-6 text-sm md:text-base text-black">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2 md:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm md:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Contact Messages</h1>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No messages match your search' : 'No contact messages found'}
          </p>
        </div>
      ) : isMobile ? (
        /* Mobile List View */
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <div key={message._id} className={`bg-white p-4 rounded-lg shadow ${message.isRead ? 'bg-gray-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{message.name}</h3>
                  <p className="text-sm text-gray-500">{message.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${message.isRead ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-700 line-clamp-1">{message.subject || 'No subject'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="View Message"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => message._id && handleDelete(message._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        sortConfig.key === 'email' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message._id} className={message.isRead ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {message.isRead ? (
                        <MailOpen className="h-5 w-5 text-green-500" />
                      ) : (
                        <Mail className="h-5 w-5 text-yellow-500" />
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{message.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Message"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => message._id && handleDelete(message._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
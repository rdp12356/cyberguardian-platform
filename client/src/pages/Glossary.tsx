import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  X,
  Filter,
  Link as LinkIcon
} from 'lucide-react';
import { GlossaryTerm, insertGlossaryTermSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

export function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const { data: terms = [], isLoading } = useQuery<GlossaryTerm[]>({
    queryKey: ['/api/glossary']
  });

  const createTermMutation = useMutation({
    mutationFn: (term: any) => apiRequest('/api/glossary', {
      method: 'POST',
      body: JSON.stringify(term),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      setShowAddModal(false);
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/glossary/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
    },
  });

  // Filter terms based on search and category
  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.term.localeCompare(b.term));

  const categories = [...new Set(terms.map(t => t.category))];

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const termData = {
      term: formData.get('term') as string,
      definition: formData.get('definition') as string,
      category: formData.get('category') as string,
      relatedTerms: (formData.get('relatedTerms') as string)
        .split(',')
        .map(term => term.trim())
        .filter(Boolean),
    };

    createTermMutation.mutate(termData);
  };

  const getRelatedTerm = (termId: string) => {
    return terms.find(t => t.term.toLowerCase() === termId.toLowerCase());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cybersecurity Glossary</h1>
              <p className="text-indigo-100 mt-2">
                Comprehensive dictionary of cybersecurity terms and concepts
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Term</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terms and definitions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            {filteredTerms.length} of {terms.length} terms
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 5).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? 'all' : category)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((term, index) => (
          <motion.div
            key={term.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedTerm(term)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {term.term}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTermMutation.mutate(term.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                <Tag className="w-3 h-3 mr-1" />
                {term.category}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
              {term.definition}
            </p>
            
            {term.relatedTerms.length > 0 && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Related terms
                </div>
                <div className="flex flex-wrap gap-1">
                  {term.relatedTerms.slice(0, 3).map((relatedTerm, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {relatedTerm}
                    </span>
                  ))}
                  {term.relatedTerms.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                      +{term.relatedTerms.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Term Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAddModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Term
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTerm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Term
                  </label>
                  <input
                    type="text"
                    name="term"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Definition
                  </label>
                  <textarea
                    name="definition"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Terms (comma separated)
                  </label>
                  <input
                    type="text"
                    name="relatedTerms"
                    placeholder="firewall, security, network"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTermMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createTermMutation.isPending ? 'Creating...' : 'Create Term'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedTerm(null)} />
            
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedTerm.term}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    <Tag className="w-4 h-4 mr-1" />
                    {selectedTerm.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Definition
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedTerm.definition}
                  </p>
                </div>
                
                {selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Related Terms
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedTerm.relatedTerms.map((relatedTermName, idx) => {
                        const relatedTerm = getRelatedTerm(relatedTermName);
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (relatedTerm) {
                                setSelectedTerm(relatedTerm);
                              }
                            }}
                            className={`p-3 text-left rounded-lg border transition-colors ${
                              relatedTerm
                                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800'
                                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700 cursor-default'
                            }`}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {relatedTermName}
                            </div>
                            {relatedTerm && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {relatedTerm.definition.substring(0, 60)}...
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
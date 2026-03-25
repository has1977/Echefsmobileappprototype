import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat, Plus, Edit2, Trash2, Users, Building2, Search, X,
  Save, Clock, Flame, Wine, Pizza, IceCream, Utensils, Coffee,
  Salad, Soup, Beef, CheckCircle, AlertCircle, Eye, Settings,
  UserPlus, UserMinus, Shield, Key, Mail, Phone, Calendar
} from 'lucide-react';

// Types
export interface Department {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
  color: string;
  branch_id: string;
  description?: string;
  status: 'active' | 'inactive';
  staff_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface DepartmentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department_id: string;
  department_name: string;
  branch_id: string;
  branch_name: string;
  role: 'department_head' | 'staff';
  status: 'active' | 'inactive';
  pin_code: string;
  last_login?: Date;
  created_at: Date;
}

const departmentIcons = {
  grill: { icon: Flame, color: 'from-orange-500 to-red-500' },
  bar: { icon: Wine, color: 'from-purple-500 to-pink-500' },
  pizza: { icon: Pizza, color: 'from-yellow-500 to-orange-500' },
  desserts: { icon: IceCream, color: 'from-pink-500 to-purple-500' },
  appetizers: { icon: Utensils, color: 'from-green-500 to-emerald-500' },
  'cold-kitchen': { icon: Salad, color: 'from-cyan-500 to-blue-500' },
  soup: { icon: Soup, color: 'from-amber-500 to-orange-500' },
  meat: { icon: Beef, color: 'from-red-600 to-red-700' },
  coffee: { icon: Coffee, color: 'from-amber-600 to-amber-700' },
};

export function AdminDepartments() {
  const navigate = useNavigate();
  const { branches } = useApp();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<DepartmentUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUsersListModal, setShowUsersListModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingUser, setEditingUser] = useState<DepartmentUser | null>(null);
  const [selectedDepartmentForUsers, setSelectedDepartmentForUsers] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState<'departments' | 'users'>('departments');

  useEffect(() => {
    loadDepartments();
    loadUsers();
  }, []);

  const loadDepartments = () => {
    const saved = localStorage.getItem('echefs_departments');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((d: any) => ({
        ...d,
        created_at: new Date(d.created_at),
        updated_at: new Date(d.updated_at),
      }));
      setDepartments(withDates);
    } else {
      // Default departments
      const defaultDepartments: Department[] = branches.flatMap(branch => [
        {
          id: `${branch.id}-grill`,
          name: 'Grill Station',
          name_ar: 'محطة الشواء',
          icon: 'grill',
          color: 'from-orange-500 to-red-500',
          branch_id: branch.id,
          description: 'Steaks, burgers, and grilled items',
          status: 'active' as const,
          staff_count: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: `${branch.id}-bar`,
          name: 'Bar',
          name_ar: 'البار',
          icon: 'bar',
          color: 'from-purple-500 to-pink-500',
          branch_id: branch.id,
          description: 'Drinks, cocktails, and beverages',
          status: 'active' as const,
          staff_count: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: `${branch.id}-pizza`,
          name: 'Pizza Station',
          name_ar: 'محطة البيتزا',
          icon: 'pizza',
          color: 'from-yellow-500 to-orange-500',
          branch_id: branch.id,
          description: 'Pizzas and flatbreads',
          status: 'active' as const,
          staff_count: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      setDepartments(defaultDepartments);
      localStorage.setItem('echefs_departments', JSON.stringify(defaultDepartments));
    }
  };

  const loadUsers = () => {
    const saved = localStorage.getItem('echefs_department_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((u: any) => ({
        ...u,
        last_login: u.last_login ? new Date(u.last_login) : undefined,
        created_at: new Date(u.created_at),
      }));
      setUsers(withDates);
    } else {
      setUsers([]);
    }
  };

  const saveDepartments = (updatedDepartments: Department[]) => {
    setDepartments(updatedDepartments);
    localStorage.setItem('echefs_departments', JSON.stringify(updatedDepartments));
  };

  const saveUsers = (updatedUsers: DepartmentUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('echefs_department_users', JSON.stringify(updatedUsers));
  };

  const handleSaveDepartment = (department: Partial<Department>) => {
    if (editingDepartment) {
      // Update
      const updated = departments.map(d =>
        d.id === editingDepartment.id
          ? { ...d, ...department, updated_at: new Date() }
          : d
      );
      saveDepartments(updated);
    } else {
      // Create
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: department.name || '',
        name_ar: department.name_ar || '',
        icon: department.icon || 'grill',
        color: department.color || 'from-gray-500 to-gray-600',
        branch_id: department.branch_id || branches[0]?.id || '',
        description: department.description,
        status: 'active',
        staff_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      saveDepartments([...departments, newDept]);
    }
    setShowDepartmentModal(false);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (id: string) => {
    if (confirm('Are you sure you want to delete this department? All associated users will be affected.')) {
      saveDepartments(departments.filter(d => d.id !== id));
      // Also delete users
      saveUsers(users.filter(u => u.department_id !== id));
    }
  };

  const handleSaveUser = (user: Partial<DepartmentUser>) => {
    if (editingUser) {
      // Update
      const updated = users.map(u =>
        u.id === editingUser.id ? { ...u, ...user } : u
      );
      saveUsers(updated);
    } else {
      // Create
      const dept = departments.find(d => d.id === user.department_id);
      const branch = branches.find(b => b.id === user.branch_id);
      
      const newUser: DepartmentUser = {
        id: `user-${Date.now()}`,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department_id: user.department_id || '',
        department_name: dept?.name || '',
        branch_id: user.branch_id || '',
        branch_name: branch?.translations.en.name || '',
        role: user.role || 'staff',
        status: 'active',
        pin_code: user.pin_code || Math.floor(1000 + Math.random() * 9000).toString(),
        created_at: new Date(),
      };
      saveUsers([...users, newUser]);
      
      // Update department staff count
      const updatedDepts = departments.map(d =>
        d.id === user.department_id
          ? { ...d, staff_count: d.staff_count + 1 }
          : d
      );
      saveDepartments(updatedDepts);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const user = users.find(u => u.id === id);
      saveUsers(users.filter(u => u.id !== id));
      
      // Update department staff count
      if (user) {
        const updatedDepts = departments.map(d =>
          d.id === user.department_id
            ? { ...d, staff_count: Math.max(0, d.staff_count - 1) }
            : d
        );
        saveDepartments(updatedDepts);
      }
    }
  };

  // Filter departments
  const filteredDepartments = departments.filter(dept => {
    const matchesBranch = selectedBranch === 'all' || dept.branch_id === selectedBranch;
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.name_ar.includes(searchQuery);
    return matchesBranch && matchesSearch;
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesBranch = selectedBranch === 'all' || user.branch_id === selectedBranch;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1F2933] mb-2">Department Management</h1>
            <p className="text-[#6B7280]">Manage restaurant departments and staff across all branches</p>
          </div>
          <Button
            onClick={() => {
              setEditingDepartment(null);
              setShowDepartmentModal(true);
            }}
            className="bg-[#667c67] hover:bg-[#546352] text-white h-12 px-6 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1 inline-flex shadow-sm">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'departments'
                ? 'bg-[#667c67] text-white shadow-md'
                : 'text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Departments
            <Badge className={activeTab === 'departments' ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}>
              {departments.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#667c67] text-white shadow-md'
                : 'text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff
            <Badge className={activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}>
              {users.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <Input
              placeholder={activeTab === 'departments' ? 'Search departments...' : 'Search staff...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-[#F9FAFB] border-0 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2933]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-12 px-4 bg-[#F9FAFB] border-0 rounded-xl font-semibold text-[#1F2933] focus:ring-2 focus:ring-[#667c67]/20"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.translations.en.name}
              </option>
            ))}
          </select>

          {activeTab === 'users' && (
            <Button
              onClick={() => {
                setEditingUser(null);
                setShowUserModal(true);
              }}
              className="bg-[#667c67] hover:bg-[#546352] text-white h-12 px-6 rounded-xl flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Staff
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'departments' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept, index) => {
            const IconComponent = departmentIcons[dept.icon as keyof typeof departmentIcons]?.icon || ChefHat;
            const branch = branches.find(b => b.id === dept.branch_id);
            const deptUsers = users.filter(u => u.department_id === dept.id);

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${dept.color} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{dept.name}</h3>
                          <p className="text-sm text-white/80">{dept.name_ar}</p>
                        </div>
                      </div>
                      <Badge className={dept.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                        {dept.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>{branch?.translations.en.name}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {dept.description && (
                      <p className="text-[#6B7280] text-sm mb-4">{dept.description}</p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                        <div className="text-2xl font-bold text-[#667c67]">{deptUsers.length}</div>
                        <div className="text-xs text-[#9CA3AF] font-medium">Staff</div>
                      </div>
                      <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                        <div className="text-2xl font-bold text-[#667c67]">
                          {deptUsers.filter(u => u.status === 'active').length}
                        </div>
                        <div className="text-xs text-[#9CA3AF] font-medium">Active</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDepartmentForUsers(dept);
                          setShowUsersListModal(true);
                        }}
                        className="flex-1 py-2.5 px-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#667c67] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        View Staff
                      </button>
                      <button
                        onClick={() => {
                          setEditingDepartment(dept);
                          setShowDepartmentModal(true);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredDepartments.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <ChefHat className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">No departments found</h3>
              <p className="text-[#6B7280]">Create your first department to get started</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">PIN Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#1F2933]">{user.name}</div>
                        <div className="text-sm text-[#9CA3AF]">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#667c67]">{user.department_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#6B7280]">{user.branch_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={user.role === 'department_head' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                        {user.role === 'department_head' ? 'Head' : 'Staff'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-[#667c67] bg-[#F9FAFB] px-3 py-1 rounded-lg inline-block">
                        {user.pin_code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <Users className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1F2933] mb-2">No staff found</h3>
                <p className="text-[#6B7280]">Add staff members to departments</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Department Modal */}
      <DepartmentModal
        open={showDepartmentModal}
        onClose={() => {
          setShowDepartmentModal(false);
          setEditingDepartment(null);
        }}
        onSave={handleSaveDepartment}
        department={editingDepartment}
        branches={branches}
      />

      {/* User Modal */}
      <UserModal
        open={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
        departments={departments}
        branches={branches}
      />

      {/* Users List Modal */}
      <UsersListModal
        open={showUsersListModal}
        onClose={() => {
          setShowUsersListModal(false);
          setSelectedDepartmentForUsers(null);
        }}
        department={selectedDepartmentForUsers}
        users={users.filter(u => u.department_id === selectedDepartmentForUsers?.id)}
        onEditUser={(user) => {
          setEditingUser(user);
          setShowUsersListModal(false);
          setShowUserModal(true);
        }}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

// Department Modal Component
function DepartmentModal({
  open,
  onClose,
  onSave,
  department,
  branches,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (dept: Partial<Department>) => void;
  department: Department | null;
  branches: any[];
}) {
  const [formData, setFormData] = useState<Partial<Department>>({});

  useEffect(() => {
    if (department) {
      setFormData(department);
    } else {
      setFormData({
        name: '',
        name_ar: '',
        icon: 'grill',
        color: 'from-orange-500 to-red-500',
        branch_id: branches[0]?.id || '',
        description: '',
        status: 'active',
      });
    }
  }, [department, branches]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {department ? 'Edit Department' : 'Create Department'}
          </DialogTitle>
          <DialogDescription>
            Configure department settings and assign to a branch
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Department Name (EN)
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grill Station"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Department Name (AR)
              </label>
              <Input
                value={formData.name_ar || ''}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="مثال: محطة الشواء"
                className="h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Branch
            </label>
            <select
              value={formData.branch_id || ''}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20 focus:border-[#667c67]"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.translations.en.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(departmentIcons).map(([key, { icon: Icon, color }]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, icon: key, color })}
                  className={`h-16 rounded-xl flex items-center justify-center transition-all ${
                    formData.icon === key
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this department..."
              className="w-full h-24 px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20 focus:border-[#667c67] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(formData)}
              className="flex-1 h-12 bg-[#667c67] hover:bg-[#546352] text-white"
              disabled={!formData.name || !formData.branch_id}
            >
              <Save className="w-4 h-4 mr-2" />
              {department ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// User Modal Component
function UserModal({
  open,
  onClose,
  onSave,
  user,
  departments,
  branches,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<DepartmentUser>) => void;
  user: DepartmentUser | null;
  departments: Department[];
  branches: any[];
}) {
  const [formData, setFormData] = useState<Partial<DepartmentUser>>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department_id: departments[0]?.id || '',
        branch_id: branches[0]?.id || '',
        role: 'staff',
        status: 'active',
        pin_code: Math.floor(1000 + Math.random() * 9000).toString(),
      });
    }
  }, [user, departments, branches]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {user ? 'Edit Staff Member' : 'Add Staff Member'}
          </DialogTitle>
          <DialogDescription>
            Create or update department staff member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Full Name
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Phone
              </label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+996 555 123 456"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                PIN Code (4 digits)
              </label>
              <Input
                value={formData.pin_code || ''}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                placeholder="1234"
                maxLength={4}
                className="h-12 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Branch
              </label>
              <select
                value={formData.branch_id || ''}
                onChange={(e) => {
                  setFormData({ ...formData, branch_id: e.target.value });
                  // Reset department when branch changes
                  const deptInBranch = departments.find(d => d.branch_id === e.target.value);
                  if (deptInBranch) {
                    setFormData(prev => ({ ...prev, department_id: deptInBranch.id }));
                  }
                }}
                className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.translations.en.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Department
              </label>
              <select
                value={formData.department_id || ''}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
              >
                {departments
                  .filter(d => d.branch_id === formData.branch_id)
                  .map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Role
            </label>
            <select
              value={formData.role || 'staff'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
            >
              <option value="staff">Staff</option>
              <option value="department_head">Department Head</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(formData)}
              className="flex-1 h-12 bg-[#667c67] hover:bg-[#546352] text-white"
              disabled={!formData.name || !formData.department_id}
            >
              <Save className="w-4 h-4 mr-2" />
              {user ? 'Update' : 'Add'} Staff
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Users List Modal Component
function UsersListModal({
  open,
  onClose,
  department,
  users,
  onEditUser,
  onDeleteUser,
}: {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  users: DepartmentUser[];
  onEditUser: (user: DepartmentUser) => void;
  onDeleteUser: (id: string) => void;
}) {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Users className="w-6 h-6 text-[#667c67]" />
            {department.name} Staff
          </DialogTitle>
          <DialogDescription>
            {users.length} staff member{users.length !== 1 ? 's' : ''} in this department
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {users.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#6B7280]">No staff members in this department yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="p-4 bg-[#F9FAFB] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#667c67] text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2933]">{user.name}</div>
                      <div className="text-sm text-[#9CA3AF]">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={user.role === 'department_head' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                      {user.role === 'department_head' ? 'Head' : 'Staff'}
                    </Badge>
                    <div className="font-mono font-bold text-[#667c67] bg-white px-3 py-1 rounded-lg">
                      {user.pin_code}
                    </div>
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

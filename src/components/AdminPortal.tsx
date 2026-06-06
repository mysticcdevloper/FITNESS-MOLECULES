/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getAllRegistrations, 
  getAllTrainerBookings, 
  getAllClassBookings, 
  getAllEnquiries,
  saveRegistration,
  saveTrainerBooking,
  saveClassBooking,
  saveEnquiry,
  deleteUserRegistration,
  deleteUserTrainerBooking,
  deleteUserClassBooking,
  deleteUserEnquiry,
  isFallbackActive,
  disableLocalFallback,
  saveAttendance,
  getAllAttendance,
  deleteAttendance,
  syncSandboxToLiveCloud
} from '../lib/firebaseService';
import { MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission, AttendanceRecord } from '../types';
import { 
  Award, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  Trash, 
  Plus, 
  Search, 
  RefreshCw, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  X,
  CreditCard,
  Target,
  Sparkles,
  Check,
  ShieldAlert
} from 'lucide-react';
import { TRAINERS, CLASSES, PLANS } from '../data/gymData';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'memberships' | 'trainers' | 'classes' | 'enquiries' | 'attendance'>('memberships');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Loaded database items
  const [registrations, setRegistrations] = useState<MembershipRegistration[]>([]);
  const [trainerBookings, setTrainerBookings] = useState<PersonalTrainerBooking[]>([]);
  const [classBookings, setClassBookings] = useState<ClassBooking[]>([]);
  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Form controlling states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<'membership' | 'trainer' | 'class' | 'enquiry' | 'attendance'>('membership');

  // Sandbox data synchronizing states
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [syncingData, setSyncingData] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState("");

  const checkUnsyncedData = () => {
    try {
      const p = JSON.parse(localStorage.getItem('molecule_photographs') || '[]');
      const r = JSON.parse(localStorage.getItem('molecule_registrations') || '[]');
      const t = JSON.parse(localStorage.getItem('molecule_trainerBookings') || '[]');
      const c = JSON.parse(localStorage.getItem('molecule_classBookings') || '[]');
      const e = JSON.parse(localStorage.getItem('molecule_enquiries') || '[]');
      const a = JSON.parse(localStorage.getItem('molecule_attendance') || '[]').filter((item: any) => item && item.id && !item.id.toString().startsWith("att_"));
      const v = JSON.parse(localStorage.getItem('molecule_videos') || '[]').filter((item: any) => item && item.id && !item.id.toString().startsWith("vid_"));
      
      setUnsyncedCount(p.length + r.length + t.length + c.length + e.length + a.length + v.length);
    } catch {
      setUnsyncedCount(0);
    }
  };

  const handleSyncToLiveCloud = async () => {
    setSyncingData(true);
    setSyncSuccessMsg("");
    try {
      const currentSandboxUser = localStorage.getItem('molecule_sandbox_user');
      const email = currentSandboxUser 
        ? JSON.parse(currentSandboxUser).email 
        : 'admin@molecule.fit';
      
      const res = await syncSandboxToLiveCloud(email);
      const total = res.photographsSynced + res.registrationsSynced + res.trainerBookingsSynced + res.classBookingsSynced + res.enquiriesSynced + res.attendanceSynced + res.videosSynced;
      setSyncSuccessMsg(`Partially synchronised ${total} offline records with live database (including ${res.photographsSynced} photographs)! Everyone list can view them now.`);
      checkUnsyncedData();
      
      // Reload admin states
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert("Sync failed: " + (err.message || err));
    } finally {
      setSyncingData(false);
    }
  };

  // New Membership Form State
  const [mPlanId, setMPlanId] = useState('p1');
  const [mFullName, setMFullName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mStartDate, setMStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [mPaymentMethod, setMPaymentMethod] = useState<'gpay' | 'paytm' | 'phonepe' | 'cash_on_counter' | 'card_pos'>('cash_on_counter');

  // New Trainer Booking Form State
  const [bTrainerId, setBTrainerId] = useState('t1');
  const [bClientName, setBClientName] = useState('');
  const [bClientEmail, setBClientEmail] = useState('');
  const [bClientPhone, setBClientPhone] = useState('');
  const [bDate, setBDate] = useState(new Date().toISOString().split('T')[0]);
  const [bTime, setBTime] = useState('10:00 AM');
  const [bNotes, setBNotes] = useState('');

  // New Class Booking Form State
  const [cClassId, setCClassId] = useState('c1');
  const [cClientName, setCClientName] = useState('');
  const [cClientEmail, setCClientEmail] = useState('');
  const [cClientPhone, setCClientPhone] = useState('');
  const [cSessionTime, setCSessionTime] = useState('Mon/Wed/Fri - 06:00 AM');

  // New Enquiry Form State
  const [eClientName, setEClientName] = useState('');
  const [eClientPhone, setEClientPhone] = useState('');
  const [eClientEmail, setEClientEmail] = useState('');
  const [eAge, setEAge] = useState(25);
  const [eFitnessGoal, setEFitnessGoal] = useState('Fat Loss');
  const [eMessage, setEMessage] = useState('');

  // New Attendance Form State
  const [attClientName, setAttClientName] = useState('');
  const [attClientEmail, setAttClientEmail] = useState('');
  const [attClientPhone, setAttClientPhone] = useState('');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent' | 'Late'>('Present');
  const [attCheckInTime, setAttCheckInTime] = useState('06:00 AM');
  const [attNotes, setAttNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent' | 'Late'>('All');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // Fetch all collections
  const fetchData = async () => {
    setLoading(true);
    try {
      const [regs, trainersB, classesB, enqs, atts] = await Promise.all([
        getAllRegistrations(),
        getAllTrainerBookings(),
        getAllClassBookings(),
        getAllEnquiries(),
        getAllAttendance()
      ]);
      setRegistrations(regs);
      setTrainerBookings(trainersB);
      setClassBookings(classesB);
      setEnquiries(enqs);
      setAttendance(atts);
    } catch (err) {
      console.error("Error fetching admin visual datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkUnsyncedData();
  }, []);

  // Update session selection state when selection matches another class
  useEffect(() => {
    const selectedC = CLASSES.find(c => c.id === cClassId);
    if (selectedC && selectedC.scheduleTimes.length > 0) {
      setCSessionTime(selectedC.scheduleTimes[0]);
    }
  }, [cClassId]);

  // Submission handles
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Assign a default userID for admin bookings
    const generatedUserId = "admin_inserted_" + Math.random().toString(36).substring(2, 9);

    try {
      if (addType === 'membership') {
        const selectedPlan = PLANS.find(p => p.id === mPlanId) || PLANS[0];
        const newRecord = {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          planDuration: selectedPlan.duration,
          planPrice: selectedPlan.price,
          fullName: mFullName,
          email: mEmail,
          phone: mPhone,
          startDate: mStartDate,
          paymentMethod: mPaymentMethod
        };
        await saveRegistration(generatedUserId, newRecord);
        setMFullName('');
        setMEmail('');
        setMPhone('');
      } else if (addType === 'trainer') {
        const selectedTrainer = TRAINERS.find(t => t.id === bTrainerId) || TRAINERS[0];
        const newRecord = {
          trainerId: selectedTrainer.id,
          trainerName: selectedTrainer.name,
          clientName: bClientName,
          clientEmail: bClientEmail,
          clientPhone: bClientPhone,
          bookingDate: bDate,
          bookingTime: bTime,
          notes: bNotes
        };
        await saveTrainerBooking(generatedUserId, newRecord);
        setBClientName('');
        setBClientEmail('');
        setBClientPhone('');
        setBNotes('');
      } else if (addType === 'class') {
        const selectedClass = CLASSES.find(c => c.id === cClassId) || CLASSES[0];
        const targetTrainer = selectedClass.trainers[0]?.name || "Assigned Coach";
        const newRecord = {
          classId: selectedClass.id,
          className: selectedClass.name,
          trainerName: targetTrainer,
          clientName: cClientName,
          clientEmail: cClientEmail,
          clientPhone: cClientPhone,
          sessionTime: cSessionTime
        };
        await saveClassBooking(generatedUserId, newRecord);
        setCClientName('');
        setCClientEmail('');
        setCClientPhone('');
      } else if (addType === 'enquiry') {
        const newRecord = {
          name: eClientName,
          phone: eClientPhone,
          email: eClientEmail,
          age: Number(eAge),
          fitnessGoal: eFitnessGoal,
          message: eMessage
        };
        await saveEnquiry(generatedUserId, newRecord);
        setEClientName('');
        setEClientPhone('');
        setEClientEmail('');
        setEMessage('');
      } else if (addType === 'attendance') {
        const newRecord = {
          clientName: attClientName,
          clientEmail: attClientEmail,
          clientPhone: attClientPhone,
          date: attDate,
          status: attStatus,
          checkInTime: attStatus !== 'Absent' ? attCheckInTime : '',
          notes: attNotes
        };
        await saveAttendance(newRecord);
        setAttClientName('');
        setAttClientEmail('');
        setAttClientPhone('');
        setAttNotes('');
      }

      setShowAddForm(false);
      await fetchData(); // Reload list
    } catch (err) {
      console.error("Admin could not save booking record:", err);
    } finally {
      setLoading(false);
    }
  };

  // Deletion locks
  const handleDeleteRegistration = async (id: string) => {
    try {
      await deleteUserRegistration(id);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      if (confirmingDeleteId === id) setConfirmingDeleteId(null);
    } catch (err) {
      console.error("Failed to cancel membership:", err);
    }
  };

  const handleDeleteTrainerBooking = async (id: string) => {
    try {
      await deleteUserTrainerBooking(id);
      setTrainerBookings(prev => prev.filter(b => b.id !== id));
      if (confirmingDeleteId === id) setConfirmingDeleteId(null);
    } catch (err) {
      console.error("Failed to cancel trainer booking:", err);
    }
  };

  const handleDeleteClassBooking = async (id: string) => {
    try {
      await deleteUserClassBooking(id);
      setClassBookings(prev => prev.filter(b => b.id !== id));
      if (confirmingDeleteId === id) setConfirmingDeleteId(null);
    } catch (err) {
      console.error("Failed to cancel class slot:", err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      await deleteUserEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (confirmingDeleteId === id) setConfirmingDeleteId(null);
    } catch (err) {
      console.error("Failed to cancel enquiry ticket:", err);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    try {
      await deleteAttendance(id);
      setAttendance(prev => prev.filter(att => att.id !== id));
      if (confirmingDeleteId === id) setConfirmingDeleteId(null);
    } catch (err) {
      console.error("Failed to delete attendance record:", err);
    }
  };

  // Searching elements matching queries
  const filterMemberships = registrations.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.phone.includes(searchQuery) ||
    m.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterTrainerBookings = trainerBookings.filter(b => 
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.clientPhone.includes(searchQuery)
  );

  const filterClassBookings = classBookings.filter(b => 
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.clientPhone.includes(searchQuery)
  );

  const filterEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery)
  );

  const filterAttendance = attendance.filter(att => 
    att.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    att.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    att.clientPhone.includes(searchQuery) ||
    att.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (att.notes && att.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="py-12 bg-zinc-950 text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header visual marker */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase font-bold">
              SYSTEM ARCHITECTURE ADMIN CONTROLS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white mt-4 uppercase">
              ADMINISTRATOR <span className="text-red-500">PORTAL</span>
            </h2>
            <div className="flex items-center gap-2 mt-3 bg-red-500/10 border border-red-500/25 px-3 py-1.5 rounded-xl w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-zinc-300 text-xs font-mono font-medium tracking-wide uppercase">
                Welcome back, Owners <span className="text-white font-bold">Ayush & Manu</span>
              </p>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3">
              Live read/write telemetry database dashboard for Molecule Athlete Booking Infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchData}
              className="p-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-red-500 rounded-xl transition-all cursor-pointer"
              title="Sync Datastore"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setShowAddForm(true);
                // Set default form types
                if (activeTab === 'memberships') setAddType('membership');
                else if (activeTab === 'trainers') setAddType('trainer');
                else if (activeTab === 'classes') setAddType('class');
                else if (activeTab === 'enquiries') setAddType('enquiry');
                else if (activeTab === 'attendance') setAddType('attendance');
              }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-500/15 cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>Create New Booking</span>
            </button>
          </div>
        </div>

        {isFallbackActive() && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start space-x-3.5">
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 mt-0.5 md:mt-0 shrink-0">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wide">Developer Sandbox Mode Active</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  This application is currently writing athlete registrations and scheduling telemetry to the browser’s Local Sandbox Session. Under sandbox environments, this bypasses dynamic domain authorization limits.
                  <strong className="text-amber-300 block mt-1">💡 Make Changes Visible to Everyone on Internet:</strong> 
                  Chrome and Safari block secure database connection inside integrated preview frames. To fix this, click to <button type="button" onClick={() => window.open(window.location.href, '_blank')} className="text-white text-xs underline font-bold bg-amber-500/20 px-2 py-0.5 rounded ml-1 hover:bg-amber-500/30 cursor-pointer border-0">Open Gym App in New Tab ↗</button>, log in with your account there, and sync!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                disableLocalFallback();
                window.location.reload();
              }}
              className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors uppercase shrink-0 font-mono tracking-wider cursor-pointer"
            >
              🔄 Reconnect Live Cloud
            </button>
          </div>
        )}

        {!isFallbackActive() && unsyncedCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start space-x-3.5">
              <div className="bg-red-500/20 p-2 rounded-xl text-red-400 mt-0.5 md:mt-0 shrink-0">
                <Sparkles className="h-5 w-5 animate-pulse text-red-550" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-400 font-mono uppercase tracking-wide">Unsynced Local Sandbox Data Detected ({unsyncedCount} items)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                  You have offline actions, bookings, or photographs saved on this browser's Sandbox. Since you are now connected to the Live Google Cloud, click the <strong>"Sync Live to Internet"</strong> button to upload them, making them visible to all visitors on the web!
                </p>
                {syncSuccessMsg && (
                  <p className="text-xs text-emerald-400 font-mono mt-1.5 font-bold animate-pulse">{syncSuccessMsg}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleSyncToLiveCloud}
              disabled={syncingData}
              className="px-5 py-2.5 bg-red-650 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all uppercase shrink-0 font-mono tracking-wider cursor-pointer shadow-lg shadow-red-500/10 active:scale-98"
            >
              {syncingData ? "Syncing..." : "📤 Sync Live to Internet"}
            </button>
          </div>
        )}

        {/* Search, metrics and switches board */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-850/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Memberships</span>
              <span className="block text-xl font-bold font-display text-white mt-0.5">{registrations.length}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl text-red-500">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-850/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Trainer Schedules</span>
              <span className="block text-xl font-bold font-display text-white mt-0.5">{trainerBookings.length}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl text-red-500">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-850/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Class Slots</span>
              <span className="block text-xl font-bold font-display text-white mt-0.5">{classBookings.length}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl text-red-500">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-850/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Diagnostic Tickets</span>
              <span className="block text-xl font-bold font-display text-white mt-0.5">{enquiries.length}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl text-red-500">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-850/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Attendance Logs</span>
              <span className="block text-xl font-bold font-display text-white mt-0.5">{attendance.length}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl text-red-500">
              <Check className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tab Selection Row & Filter Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap p-1 bg-zinc-905 border border-zinc-850 rounded-2xl w-full lg:w-auto">
            <button
              onClick={() => { setActiveTab('memberships'); setSearchQuery(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'memberships' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <Award className="h-4 w-4" />
              <span>Memberships</span>
            </button>
            <button
              onClick={() => { setActiveTab('trainers'); setSearchQuery(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'trainers' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <Calendar className="h-4 w-4" />
              <span>Trainer Bookings</span>
            </button>
            <button
              onClick={() => { setActiveTab('classes'); setSearchQuery(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'classes' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Class Slots</span>
            </button>
            <button
              onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'enquiries' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Enquiries</span>
            </button>
            <button
              onClick={() => { setActiveTab('attendance'); setSearchQuery(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === 'attendance' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <Check className="h-4 w-4" />
              <span>Attendance</span>
            </button>
          </div>

          <div className="relative w-full lg:max-w-xs shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-300 placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Database records list viewport */}
        {loading && (
          <div className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-16 text-center">
            <RefreshCw className="h-8 w-8 text-red-500 mx-auto animate-spin mb-4" />
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest leading-none">Syncing telemetry database...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* MEMBERSHIPS LISTING TAB */}
            {activeTab === 'memberships' && (
              <div className="space-y-4">
                {filterMemberships.length === 0 ? (
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-16">
                    <Award className="h-12 w-12 text-zinc-800 mx-auto mb-4 stroke-[1.5]" />
                    <p className="text-zinc-400 font-display text-sm font-medium">No registrations found matching description</p>
                    <p className="text-zinc-600 text-xs font-sans mt-1">Try refining search parameters or create a new booking above.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filterMemberships.map((reg) => (
                      <div key={reg.id} className="bg-zinc-900 border border-zinc-850 hover:border-zinc-800 p-6 rounded-2xl relative flex flex-col justify-between transition-colors">
                        <span className="absolute top-4 right-4 bg-red-500/10 border border-red-500/10 text-red-500 font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          PLAN: {reg.planDuration}
                        </span>
                        
                        <div>
                          <div className="flex items-center space-x-2 text-zinc-200">
                            <span className="bg-zinc-950 p-2 text-red-500 rounded-lg">
                              <Award className="h-4 w-4" />
                            </span>
                            <div>
                              <h4 className="text-white font-display font-bold text-lg leading-tight uppercase">{reg.planName}</h4>
                              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">PRICE: {reg.planPrice}</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-zinc-850 pt-4 space-y-2 text-xs font-sans">
                            <div className="flex items-center space-x-2">
                              <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-300 font-medium">Client: </span>
                              <span className="text-white font-medium">{reg.fullName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400">Email: </span>
                              <span className="text-zinc-200 select-all truncate">{reg.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400 font-mono">Contact: </span>
                              <span className="text-zinc-200 font-mono">{reg.phone}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900">
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Activated</span>
                                <span className="block text-[11px] font-medium text-white italic mt-0.5">{reg.startDate}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase font-bold">Billing Mode</span>
                                <span className="block text-[11px] font-bold text-red-500 uppercase mt-0.5">{reg.paymentMethod.replace(/_/g, ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase select-all">UserUID: {reg.userId.substring(0,18)}...</span>
                          <div className="flex items-center space-x-2">
                            {confirmingDeleteId === reg.id ? (
                              <>
                                <button
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(reg.id)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-red-950/20 transition-all cursor-pointer animate-pulse"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Confirm Delete</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmingDeleteId(reg.id)}
                                className="bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-450 p-2 rounded-xl transition-colors cursor-pointer"
                                title="Cancel Application"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TRAINER BOOKINGS LISTING TAB */}
            {activeTab === 'trainers' && (
              <div className="space-y-4">
                {filterTrainerBookings.length === 0 ? (
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-16">
                    <Calendar className="h-12 w-12 text-zinc-800 mx-auto mb-4 stroke-[1.5]" />
                    <p className="text-zinc-400 font-display text-sm font-medium">No personal coach bookings found</p>
                    <p className="text-zinc-600 text-xs font-sans mt-1">Create trainer reservations to populate this list.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filterTrainerBookings.map((b) => (
                      <div key={b.id} className="bg-zinc-900 border border-zinc-850 hover:border-zinc-800 p-6 rounded-2xl relative flex flex-col justify-between transition-colors">
                        <span className="absolute top-4 right-4 bg-orange-500/10 border border-orange-500/10 text-orange-400 font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          1-ON-1 PT
                        </span>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-zinc-950 p-2 text-red-500 rounded-lg">
                              <Calendar className="h-4 w-4" />
                            </span>
                            <div>
                              <h4 className="text-white font-display font-medium text-base leading-tight uppercase font-bold text-red-500">{b.trainerName}</h4>
                              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Trainer ID: {b.trainerId}</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-zinc-850 pt-4 space-y-2 text-xs font-sans">
                            <div className="flex items-center space-x-2">
                              <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-300 font-medium">Client: </span>
                              <span className="text-white font-medium">{b.clientName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400">Email: </span>
                              <span className="text-zinc-200 select-all truncate">{b.clientEmail}</span>
                            </div>
                            {b.clientPhone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                <span className="text-zinc-400">Contact: </span>
                                <span className="text-zinc-200 font-mono">{b.clientPhone}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 mt-3 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900">
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Session Date</span>
                                <span className="block text-[11px] font-medium text-white mt-0.5 font-mono">{b.bookingDate}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Target Time</span>
                                <span className="block text-[11px] font-bold text-red-500 mt-0.5 font-mono uppercase">{b.bookingTime}</span>
                              </div>
                            </div>
                            {b.notes && (
                              <div className="mt-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-zinc-400 italic text-xs leading-relaxed">
                                <span className="not-italic block text-[8px] font-mono uppercase text-zinc-550 mb-0.5">Notes from insert:</span>
                                "{b.notes}"
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase">UUID: {b.id}</span>
                          <div className="flex items-center space-x-2">
                            {confirmingDeleteId === b.id ? (
                              <>
                                <button
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteTrainerBooking(b.id)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-red-950/20 transition-all cursor-pointer animate-pulse"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Confirm Delete</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmingDeleteId(b.id)}
                                className="bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-450 p-2 rounded-xl transition-colors cursor-pointer"
                                title="Delete Booking"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CLASS BOOKINGS LISTING TAB */}
            {activeTab === 'classes' && (
              <div className="space-y-4">
                {filterClassBookings.length === 0 ? (
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-16">
                    <CheckSquare className="h-12 w-12 text-zinc-800 mx-auto mb-4 stroke-[1.5]" />
                    <p className="text-zinc-400 font-display text-sm font-medium">No group class registrations found</p>
                    <p className="text-zinc-600 text-xs font-sans mt-1">Classes booked by active customers will print here.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filterClassBookings.map((b) => (
                      <div key={b.id} className="bg-zinc-905 border border-zinc-850 hover:border-zinc-800 p-6 rounded-2xl relative flex flex-col justify-between transition-colors">
                        <span className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/10 text-purple-400 font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          GROUP CLASS
                        </span>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-zinc-950 p-2 text-red-500 rounded-lg">
                              <CheckSquare className="h-4 w-4" />
                            </span>
                            <div>
                              <h4 className="text-white font-display font-black text-base leading-tight uppercase font-sans tracking-tight">{b.className}</h4>
                              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Coach: {b.trainerName}</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-zinc-850 pt-4 space-y-2 text-xs font-sans">
                            <div className="flex items-center space-x-2">
                              <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-300 font-medium">Client: </span>
                              <span className="text-white font-medium">{b.clientName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400">Email: </span>
                              <span className="text-zinc-200 select-all truncate">{b.clientEmail}</span>
                            </div>
                            {b.clientPhone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                <span className="text-zinc-400">Phone: </span>
                                <span className="text-zinc-200 font-mono">{b.clientPhone}</span>
                              </div>
                            )}
                            <div className="bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900 mt-3 flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-red-500" />
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Class Schedule Time</span>
                                <span className="block text-[11px] font-medium text-white italic mt-0.5">{b.sessionTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase">Class ID: {b.classId}</span>
                          <div className="flex items-center space-x-2">
                            {confirmingDeleteId === b.id ? (
                              <>
                                <button
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteClassBooking(b.id)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-red-950/20 transition-all cursor-pointer animate-pulse"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Confirm Delete</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmingDeleteId(b.id)}
                                className="bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-450 p-2 rounded-xl transition-colors cursor-pointer"
                                title="Delete Slot"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ENQUIRIES LISTING TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                {filterEnquiries.length === 0 ? (
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-16">
                    <MessageSquare className="h-12 w-12 text-zinc-800 mx-auto mb-4 stroke-[1.5]" />
                    <p className="text-zinc-400 font-display text-sm font-medium">No visitor enquiries found</p>
                    <p className="text-zinc-600 text-xs font-sans mt-1">Customer diagnostic enquiries load instantly here.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filterEnquiries.map((e) => (
                      <div key={e.id} className="bg-zinc-900 border border-zinc-850 hover:border-zinc-800 p-6 rounded-2xl relative flex flex-col justify-between transition-colors">
                        <span className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          TICKET: ENQ
                        </span>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-zinc-950 p-2 text-red-500 rounded-lg">
                              <MessageSquare className="h-4 w-4" />
                            </span>
                            <div>
                              <h4 className="text-white font-display font-bold text-base leading-tight uppercase">{e.name}</h4>
                              <p className="text-[10px] font-mono text-zinc-550 mt-0.5">Age/Biological: {e.age} Years</p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-zinc-850 pt-4 space-y-2 text-xs font-sans">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400">Email: </span>
                              <span className="text-zinc-200 select-all truncate">{e.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400">Contact: </span>
                              <span className="text-zinc-200 font-mono">{e.phone}</span>
                            </div>
                            <div className="bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900 mt-3 flex items-center space-x-2">
                              <Target className="h-4 w-4 text-red-500" />
                              <div>
                                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Core Fitness Goal</span>
                                <span className="block text-[11px] font-bold text-red-500 uppercase mt-0.5 font-sans leading-none">{e.fitnessGoal}</span>
                              </div>
                            </div>
                            {e.message && (
                              <div className="mt-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-zinc-300 italic text-xs leading-relaxed">
                                <span className="not-italic block text-[8px] font-mono uppercase text-zinc-550 mb-0.5">Aesthetic / Diagnostic message:</span>
                                "{e.message}"
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-950 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase">Ticket ID: {e.id}</span>
                          <div className="flex items-center space-x-2">
                            {confirmingDeleteId === e.id ? (
                              <>
                                <button
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteEnquiry(e.id)}
                                  className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-red-955/20 transition-all cursor-pointer animate-pulse"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Confirm Delete</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmingDeleteId(e.id)}
                                className="bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-455 p-2 rounded-xl transition-colors cursor-pointer"
                                title="Delete Ticket"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ATTENDANCE LISTING TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                {/* Status Filter Chips and Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-850 p-4 rounded-2xl">
                  <div>
                    <h3 className="text-white font-display font-medium text-sm uppercase tracking-wider">Status Filtering Telemetry</h3>
                    <p className="text-zinc-500 text-xs font-sans mt-0.5">Filter records by active physical attendance tags.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['All', 'Present', 'Absent', 'Late'] as const).map((chip) => {
                      const count = chip === 'All' 
                        ? filterAttendance.length 
                        : filterAttendance.filter(a => a.status === chip).length;
                      return (
                        <button
                          key={chip}
                          onClick={() => setStatusFilter(chip)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                            statusFilter === chip 
                              ? 'bg-red-500 text-white' 
                              : 'bg-zinc-955 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-850'
                          }`}
                        >
                          {chip} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {filterAttendance.filter(a => statusFilter === 'All' ? true : a.status === statusFilter).length === 0 ? (
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-12 text-center max-w-xl mx-auto py-16">
                    <Check className="h-12 w-12 text-zinc-800 mx-auto mb-4 stroke-[1.5]" />
                    <p className="text-zinc-400 font-display text-sm font-medium">No matching attendance logs found</p>
                    <p className="text-zinc-600 text-xs font-sans mt-1">Add client check-ins easily using "Create New Booking" and selecting the Attendance option.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    {filterAttendance
                      .filter(a => statusFilter === 'All' ? true : a.status === statusFilter)
                      .map((att) => (
                        <div key={att.id} className="bg-zinc-900 border border-zinc-850 hover:border-zinc-800 p-5 rounded-2xl relative flex flex-col justify-between transition-colors">
                          <span className={`absolute top-4 right-4 font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            att.status === 'Present' 
                              ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400' 
                              : att.status === 'Late'
                              ? 'bg-amber-500/15 border border-amber-500/20 text-amber-400'
                              : 'bg-rose-500/15 border border-rose-500/20 text-rose-400'
                          }`}>
                            {att.status}
                          </span>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-zinc-950 p-2 text-red-500 rounded-lg shrink-0">
                                <User className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-white font-display font-bold text-sm uppercase truncate leading-tight">{att.clientName}</h4>
                                <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">{att.date}</span>
                              </div>
                            </div>

                            <div className="mt-4 border-t border-zinc-850/60 pt-3 space-y-2 text-xs font-sans">
                              {att.status !== 'Absent' && att.checkInTime && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                  <span className="text-zinc-400 font-medium">Checked In: </span>
                                  <span className="text-white font-mono">{att.checkInTime}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-zinc-400">
                                <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                <span className="text-zinc-400">Email: </span>
                                <span className="text-zinc-200 truncate select-all">{att.clientEmail}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-zinc-400">
                                <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                                <span className="text-zinc-400">Phone: </span>
                                <span className="text-zinc-200 font-mono select-all">{att.clientPhone}</span>
                              </div>
                              
                              {att.notes && (
                                <div className="mt-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 text-zinc-300 italic text-[11px] leading-relaxed">
                                  <span className="not-italic block text-[8px] font-mono uppercase text-zinc-650 mb-0.5">Trainer Notes / Health Status:</span>
                                  "{att.notes}"
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-zinc-950 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-zinc-550 uppercase">LOG ID: {att.id}</span>
                            <div className="flex items-center space-x-2">
                              {confirmingDeleteId === att.id ? (
                                <>
                                  <button
                                    onClick={() => setConfirmingDeleteId(null)}
                                    className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 px-2.5 py-1.25 rounded-md text-[10px] font-mono transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAttendance(att.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-2.5 py-1.25 rounded-md text-[10px] flex items-center space-x-1 shadow-md shadow-red-955/20 transition-all cursor-pointer animate-pulse"
                                  >
                                    <Check className="h-3 w-3" />
                                    <span>Confirm Delete</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setConfirmingDeleteId(att.id)}
                                  className="bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-400 hover:text-rose-450 p-1.5 rounded-xl transition-colors cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* CREATE NEW BOOKING FORM (Interactive Overlaid Modular Form) */}
      {showAddForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAddForm(false)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Close Trigger */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-950 border border-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 flex-1 space-y-6">
              <div>
                <span className="bg-red-500/10 text-red-500 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                  Database Insertion console
                </span>
                <h3 className="text-xl font-display font-medium text-white leading-tight">
                  ADD NEW BOOKING FROM ADMIN END
                </h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Insert fully validated data profiles straight to Molecule databases bypassed from local limitations.
                </p>
              </div>

              {/* Add category options check */}
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-zinc-950 border border-zinc-850 rounded-xl text-center">
                <button
                  type="button"
                  onClick={() => setAddType('membership')}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${addType === 'membership' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  Plan
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('trainer')}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${addType === 'trainer' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('class')}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${addType === 'class' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  Class
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('enquiry')}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${addType === 'enquiry' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('attendance')}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${addType === 'attendance' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  CheckIn
                </button>
              </div>

              {/* Dynamic Forms */}
              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                
                {addType === 'membership' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Select Club Plan</label>
                      <select 
                        value={mPlanId} 
                        onChange={(e) => setMPlanId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                      >
                        {PLANS.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.duration} - {p.price})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Client Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={mFullName} 
                        onChange={(e) => setMFullName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra" 
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={mEmail} 
                          onChange={(e) => setMEmail(e.target.value)}
                          placeholder="client@gmail.com" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Contact Phone</label>
                        <input 
                          type="tel" 
                          required 
                          value={mPhone} 
                          onChange={(e) => setMPhone(e.target.value)}
                          placeholder="+919876543210" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Activation Term Start</label>
                        <input 
                          type="date" 
                          required 
                          value={mStartDate} 
                          onChange={(e) => setMStartDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Billing Channel</label>
                        <select 
                          value={mPaymentMethod} 
                          onChange={(e) => setMPaymentMethod(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 uppercase font-mono"
                        >
                          <option value="cash_on_counter">Cash counter transaction</option>
                          <option value="gpay">GPay Business</option>
                          <option value="paytm">Paytm UPI POS</option>
                          <option value="phonepe">PhonePe merchant wallet</option>
                          <option value="card_pos">Credit/Debit POS Terminal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {addType === 'trainer' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Select Personal Coach</label>
                      <select 
                        value={bTrainerId} 
                        onChange={(e) => setBTrainerId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                      >
                        {TRAINERS.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.experience})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Client Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={bClientName} 
                        onChange={(e) => setBClientName(e.target.value)}
                        placeholder="e.g. Suresh Kumar" 
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Client Email</label>
                        <input 
                          type="email" 
                          required 
                          value={bClientEmail} 
                          onChange={(e) => setBClientEmail(e.target.value)}
                          placeholder="client@gmail.com" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Contact Phone</label>
                        <input 
                          type="tel" 
                          required 
                          value={bClientPhone} 
                          onChange={(e) => setBClientPhone(e.target.value)}
                          placeholder="+919812345678" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Appointment Date</label>
                        <input 
                          type="date" 
                          required 
                          value={bDate} 
                          onChange={(e) => setBDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Slot Timings</label>
                        <select 
                          value={bTime} 
                          onChange={(e) => setBTime(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono"
                        >
                          <option value="06:00 AM">06:00 AM (Early Active)</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="10:00 AM">10:00 AM (Mid Peak)</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="06:00 PM">06:00 PM (Late High Intensity)</option>
                          <option value="08:00 PM">08:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Special Directives / Workout Notes</label>
                      <textarea 
                        value={bNotes} 
                        onChange={(e) => setBNotes(e.target.value)}
                        placeholder="e.g. Needs postural correction drills for spinal decompression..." 
                        rows={2}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {addType === 'class' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Select Group Class Route</label>
                      <select 
                        value={cClassId} 
                        onChange={(e) => setCClassId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                      >
                        {CLASSES.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Select Matching Timings Slot</label>
                      <select 
                        value={cSessionTime} 
                        onChange={(e) => setCSessionTime(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono"
                      >
                        {(CLASSES.find(c => c.id === cClassId) || CLASSES[0]).scheduleTimes.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Client Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={cClientName} 
                        onChange={(e) => setCClientName(e.target.value)}
                        placeholder="e.g. Dr. Aayush Sinha" 
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Client Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={cClientEmail} 
                          onChange={(e) => setCClientEmail(e.target.value)}
                          placeholder="client@gmail.com" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          value={cClientPhone} 
                          onChange={(e) => setCClientPhone(e.target.value)}
                          placeholder="+919812344321" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {addType === 'enquiry' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Enquirer/Visitor Name</label>
                      <input 
                        type="text" 
                        required 
                        value={eClientName} 
                        onChange={(e) => setEClientName(e.target.value)}
                        placeholder="e.g. Mohit Agrawal" 
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={eClientEmail} 
                          onChange={(e) => setEClientEmail(e.target.value)}
                          placeholder="visitor@gmail.com" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Visitor Contact Phone</label>
                        <input 
                          type="tel" 
                          required 
                          value={eClientPhone} 
                          onChange={(e) => setEClientPhone(e.target.value)}
                          placeholder="+9198754210" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Visitor's Age</label>
                        <input 
                          type="number" 
                          required 
                          min={1}
                          max={120}
                          value={eAge} 
                          onChange={(e) => setEAge(Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Physique/Fitness Target</label>
                        <select 
                          value={eFitnessGoal} 
                          onChange={(e) => setEFitnessGoal(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Fat Loss">Physique Fat Oxidation</option>
                          <option value="Muscle Gain">Biomechanical Muscle Hypertrophy</option>
                          <option value="Cardio Conditioning">VO2 Max Athletic Optimization</option>
                          <option value="Injury Rehabilitation">Skeletal Longevity & Posture</option>
                          <option value="General Strength">General Joint Strength</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Diagnostic Advisory Query Text</label>
                      <textarea 
                        value={eMessage} 
                        onChange={(e) => setEMessage(e.target.value)}
                        placeholder="Medical background or specific kinesiology consultation topics..." 
                        rows={3}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {addType === 'attendance' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Athlete Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={attClientName} 
                        onChange={(e) => setAttClientName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra" 
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={attClientEmail} 
                          onChange={(e) => setAttClientEmail(e.target.value)}
                          placeholder="client@molecule.fit" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Contact Phone</label>
                        <input 
                          type="tel" 
                          required 
                          value={attClientPhone} 
                          onChange={(e) => setAttClientPhone(e.target.value)}
                          placeholder="+919876543210" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Status</label>
                        <select 
                          value={attStatus} 
                          onChange={(e) => setAttStatus(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono"
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>
                      
                      <div className="col-span-1">
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Date</label>
                        <input 
                          type="date" 
                          required 
                          value={attDate} 
                          onChange={(e) => setAttDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Check-In</label>
                        <input 
                          type="text" 
                          disabled={attStatus === 'Absent'}
                          value={attCheckInTime} 
                          onChange={(e) => setAttCheckInTime(e.target.value)}
                          placeholder="06:30 AM" 
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none disabled:opacity-45 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono uppercase tracking-wider mb-1">Trainer Check-in Notes</label>
                      <textarea 
                        value={attNotes} 
                        onChange={(e) => setAttNotes(e.target.value)}
                        placeholder="Morning routine updates, physical complaints or targeted biophysical indicators..." 
                        rows={2}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl text-center text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>{loading ? "Saving to Cloud..." : "Insert Booking Slot"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

import { motion } from 'motion/react';
import { X, Bell, Check, Trash2, ShieldAlert, Award, CreditCard, UserPlus, Info } from 'lucide-react';

export interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: 'security' | 'billing' | 'onboarding' | 'system';
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case 'billing':
        return <CreditCard className="h-4 w-4 text-amber-600" />;
      case 'onboarding':
        return <UserPlus className="h-4 w-4 text-emerald-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="relative w-96 bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-10 text-slate-800 animate-slideIn"
      >
        {/* Header container */}
        <div className="p-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600 animate-pulse" />
            <h2 className="font-extrabold text-sm tracking-tight text-slate-900">System Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white font-extrabold text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Controls */}
        {notifications.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px]">
            <button
              onClick={onMarkAllRead}
              className="text-[#3b82f6] hover:text-blue-700 font-extrabold cursor-pointer transition-colors flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
            <span className="text-slate-400 font-bold tracking-wider font-mono uppercase text-[9px]">Live Feed Active</span>
          </div>
        )}

        {/* Notification list wrapper */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1 max-w-64 mx-auto">There are no unread super admin alert notifications at this time.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-lg border transition-all relative group flex flex-col gap-1.5 ${
                  notif.read
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-80 shadow-none'
                    : 'bg-blue-50/20 border-blue-150 shadow-[0_1px_3px_rgba(37,99,235,0.04)]'
                }`}
              >
                {/* Visual Category Dot and Close triggers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      notif.read ? 'bg-slate-100' : 'bg-blue-50 border border-blue-100'
                    }`}>
                      {getCategoryIcon(notif.category)}
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                      {notif.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        onClick={() => onMarkRead(notif.id)}
                        className="p-1 hover:bg-slate-100 rounded text-emerald-605 hover:text-emerald-700 cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteNotification(notif.id)}
                      className="p-1 hover:bg-slate-100 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <div className="mt-0.5">
                  <h4 className={`text-xs font-bold leading-tight ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>

                {/* Time stamps */}
                <div className="text-[9px] text-slate-400 font-bold font-mono text-right mt-1 uppercase">
                  {notif.time}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

import EmployeeShell from '../../components/employee/EmployeeShell.jsx';

export default function EmployeeContactsPage() {
  return (
    <EmployeeShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Employee Workspace
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Contacts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage CRM contacts and customer communication.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">All Contacts</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your assigned customer contacts.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              ['Priya Sharma', 'Sharma Textiles', '+91 98765 43210', 'priya@example.com', 'Active'],
              ['Rohan Mehta', 'Mehta Associates', '+91 99887 77665', 'rohan@example.com', 'New'],
              ['Amit Verma', 'AV Enterprises', '+91 91234 56789', 'amit@example.com', 'Demo'],
            ].map((item) => (
              <div key={item[0]} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{item[0]}</h3>
                  <p className="text-sm text-slate-500">{item[1]}</p>
                </div>

                <div className="text-sm text-slate-600 hidden md:block">
                  {item[2]}
                </div>

                <div className="text-sm text-slate-600 hidden lg:block">
                  {item[3]}
                </div>

                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  {item[4]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeShell>
  );
}

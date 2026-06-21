import { lazy, Suspense } from 'react';
import '../../salesflow-hub/hubScoped.css';

const SalesFlowHubApp = lazy(() => import('../../salesflow-hub/App.tsx'));

export default function SalesFlowHubBridge() {
  return (
    <Suspense fallback={<div className="crm-session-loader"><div className="crm-session-loader__card">Loading Super Admin workspace...</div></div>}>
      <SalesFlowHubApp />
    </Suspense>
  );
}

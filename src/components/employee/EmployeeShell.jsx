import './EmployeeShell.css';

const menu = [
  ['Dashboard','/employee/dashboard','D'],
  ['My Leads','/leads','L'],
  ['Contacts','/contacts','C'],
  ['Won','/employee/won','W'],
  ['Tasks','/employee/tasks','T'],
  ['Calendar','/employee/calendar','Cal'],
  ['Activities','/employee/activities','A'],
  ['Reports','/employee/reports','R'],
  ['Notifications','/notifications','N'],
  ['Profile','/employee/profile','P'],
  ['Settings','/settings','S']
];

function go(path){
  window.history.pushState({},'',path);
  window.dispatchEvent(new
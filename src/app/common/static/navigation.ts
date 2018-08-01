import { SidenavLink } from './../../components/sidenav-list/sidenav-list.component'


const unsigned = [
  new SidenavLink('Utilisateur', '', '', true, false, false, false),
  new SidenavLink('Accueil', '', 'home', false, false, false, false),
  new SidenavLink('Se connecter', 'sign-in', 'person_outline', false, false, false, false),
  new SidenavLink('Créer un compte', 'sign-up', 'person_add', false, false, false, false),
]
const signed = [
  new SidenavLink('Utilisateur', '', '', true, false, false, false),
  new SidenavLink('Accueil', '/', 'home', false, false, false, false),
  new SidenavLink('Se déconnecter', 'sign-out', 'person', false, false, false, false),
]
const inactive = [
  new SidenavLink('Inscription', '', '', true, false, false, false),
  new SidenavLink('Procédure', 'register', 'timeline', false, false, false, false),
]
const active = [
  new SidenavLink('Paramètres', '', '', true, false, false, false),
  new SidenavLink('Animaux', 'settings/animal', 'settings', false, false, false, false),
  new SidenavLink('Finance', 'settings/finance', 'account_balance', false, false, false, false),
  new SidenavLink('Profil', 'profile', 'person', false, false, false, false),

  new SidenavLink('Gestion', '', '', true, false, false, false),
  new SidenavLink('Agenda', 'agenda', 'event', false, false, false, false),
  new SidenavLink('Animaux', 'search/animals', 'search', false, false, false, false),
  new SidenavLink('Clients', 'customer-lazy/customers', 'people', false, false, false, false),
  new SidenavLink('Finance', 'invoice-lazy/invoices', 'account_balance', false, false, false, false),
  new SidenavLink('Comptabilité', 'accounting-lazy', 'attach_money', false, false, false, false),
  new SidenavLink('Satistiques', 'statistics-lazy', 'pie_chart', false, false, false, false),
]
const support = [
  new SidenavLink('Support', '', '', true, false, false, false),
  new SidenavLink('Aide', 'https://github.com/malikabolle/osteopratik/blob/master/README.md', 'help_outline', false, false, true, false),
  new SidenavLink('Signaler un bug', 'https://github.com/malikabolle/osteopratik/issues', 'bug_report', false, false, true, false),
]
const admin = [
  new SidenavLink('Administration', '', '', true, false, false, false),
  new SidenavLink('Ostéopathes', 'admin-lazy/access-update', 'people_outline', false, false, false, false),
  new SidenavLink('Sauvegarde', 'admin-lazy/backup', 'backup', false, false, false, false),
]
const about = [
  new SidenavLink('A propos', 'about', 'info', false, false, false, false),
  new SidenavLink('Mettre à jour', 'reload', 'cached', false, false, false, true),
  new SidenavLink('Changer de thème', 'toggleTheme', 'invert_colors', false, false, false, true),
]


export const visitorNavigation = [
  ...unsigned
]

export const inactiveAccountNavigation = [
  ...signed,
  ...inactive,
  ...support,
  ...about,
]

export const activeAccountNavigation = [
  ...signed,
  ...active,
  ...support,
  ...about,
]

export const adminNavigation = [
  ...signed,
  ...active,
  ...admin,
  ...support,
  ...about,
]

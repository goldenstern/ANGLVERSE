import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
// import Withdraw from '../views/Withdraw.vue'
import Hello from '../views/Hello.vue'
import RegisterRef from '../views/Ref.vue'
import SendCoins from '../views/SendCoins.vue'
import Exchange from '../views/Exchange.vue'
import Eidol from '../views/Eidol.vue'
import RequestPasswordReset from '../views/RequestPasswordReset.vue'
import ChangePassword from '../views/ChangePassword.vue'
import EmailConfirmed from '../views/EmailConfirmed.vue'
import EggShop from '../views/EggShop.vue'
import DAOShop from '../views/DAOShop.vue'
import DAOChest from '../views/DAOChest.vue'
import DAOLedger from '../views/DAOLedger.vue'
import PopEidol from '../views/PopEidol.vue'
import TrainEidol from '../views/TrainEidol.vue'
import ExtractEidol from '../views/Extract.vue'
import FeedEidol from '../views/Feed.vue'
import AppleEidol from '../views/Apple.vue'
import RefMarket from '../views/RefMarket.vue'
import TaxBox from '../views/TaxBox.vue'
// import BuyHO from '../views/BuyHO.vue'
import Onboarding from '../views/Onboarding.vue'
import StarterBuy from '../views/StarterBuy.vue'
import StarterGas from '../views/StarterGas.vue'
// import Forum from '../views/Forum.vue'
import ForumFull from '../views/ForumFull.vue'
import Ditch from '../views/Ditch.vue'
import state from '../store/state.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: '/hello',
    name: "Hello",
    component: Hello,
    meta: {
      guest: true,
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/eidol',
    name: 'Eidol',
    component: Eidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  //   meta: {
  //     guest: true,
  //   },
  // },
  {
    path: '/register/code/:code',
    name: "Register",
    component: Register,
    props: true,
    meta: {
      guest: true,
    },
  },
  {
    path: '/register/',
    name: "Register",
    component: Register,
    meta: {
      guest: true,
    },
  },
  {
    path: '/mageshop',
    name: "EggShop",
    component: EggShop,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/gdaoshop',
    name: "gDAOShop",
    component: DAOShop,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/gdaochest',
    name: "gDAOChest",
    component: DAOChest,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/gdaoledger',
    name: "gDAOLedger",
    component: DAOLedger,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/starterbuy',
    name: "StarterBuy",
    component: StarterBuy,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/startergas',
    name: "StarterGas",
    component: StarterGas,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/forum',
    name: "Forum",
    component: ForumFull,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/ditch',
    name: "Ditch",
    component: Ditch,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/forumtest',
  //   name: "ForumTest",
  //   component: ForumFull,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
  {
    path: '/coop',
    name: "GoldenState Cooperation",
    component: RefMarket,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/tax',
    name: "GoldenState Tax Box",
    component: TaxBox,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/buyheidol',
  //   name: "BuyHO",
  //   component: BuyHO,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
  {
    path: '/pop',
    name: "PopEidol",
    component: PopEidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/transmute',
    name: "TransmuteEidol",
    component: TrainEidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/extract',
    name: "ExtractEidol",
    component: ExtractEidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/feed',
    name: "FeedEidol",
    component: FeedEidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/apple',
    name: "AppleEidol",
    component: AppleEidol,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/exchange',
    name: "Exchange",
    component: Exchange,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/send/:sendto?',
    name: "SendCoins",
    component: SendCoins,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/register/ref/:code',
    name: "RegisterRef",
    component: RegisterRef,
    props: true,
    meta: {
      guest: true,
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: RequestPasswordReset,
    meta: {
      guest: true,
    },
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password-form',
    component: ChangePassword,
    props: true,
    meta: {
      guest: true,
    },
  },
  {
    path: '/verify-email/:message/:message2',
    name: 'email-confirmed-form',
    component: EmailConfirmed,
    props: true,
    meta: {
      guest: true,
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = state.user
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!currentUser.id) {
      next({
        path: '/hello',
        params: { nextUrl: to.fullPath }
      })
    } else {
      if (to.matched.some(record => record.meta.is_admin)) {
        if (currentUser.is_admin == 1) {
          next()
        } else {
          next({ path: '/' })
        }
      } else {
        //console.log('router.beforeEach to', to);
        if (!currentUser.completed_onboarding && to.name != 'Onboarding') {
          next({name: 'Onboarding'})
        }
        // } else if (currentUser.completed_onboarding && !currentUser.start_gas && to.name != 'StarterGas') {
        //   next({name: 'StarterGas'})
        // } else if (currentUser.completed_onboarding && currentUser.start_gas && !currentUser.start_pack && to.name != 'StarterBuy') {
        //   next({name: 'StarterBuy'})
        // } else {
        else {
          next()
        }
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (currentUser.id == null) {
      next()
    } else {
      next()
      //~ next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router

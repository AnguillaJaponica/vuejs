//APIで取得したデータ
const userData = [
    {
        id: 1,
        name: 'Takuya Tejima',
        description: '東南アジアで働くエンジニアです'
    },
    {
        id: 2,
        name: 'Yohei Noda',
        description: 'アウトドアが趣味のエンジニアです'
    }
];

//ユーザ一覧のデータを取得
let getUsers = function (callback) {
    setTimeout(function () {
        callback(null, userData)
    }, 1000)
};

let UserList = {
    template: '#user-list',
    data: function () {
        return {
            loading: false,
            users: function () {
                return [];
            },
            error: null
        }
    },

    created: function () {
        this.fetchData()
    },

    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            this.loading = true;
            getUsers((function (err, users) {
                this.loading = false;
                if (err) {
                    this.error = err.toString()
                } else {
                    this.users = users
                }
            }).bind(this))
        }
    }
};

//ユーザ詳細のデータを取得
let getUser = function (userid, callback) {
    setTimeout(function () {
        let filteredUsers = userData.filter(function (user) {
            return user.id === parseInt(userid, 10)
        });
        callback(null, filteredUsers && filteredUsers[0])
    }, 1000)
};

let UserDetail = {
    template: '#user-detail',
    data: function () {
        return {
            loading: false,
            user: null,
            error: null
        }
    },

    created: function () {
        this.fetchData()
    },

    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            this.loading = true;
            getUser(this.$route.params.userid, (function (err, user) {
                this.loading = false;
                if (err) {
                    this.error = err.toString()
                } else {
                    this.user = user
                }
            }).bind(this))
        }
    }
};

//ユーザ新規登録
let postUser = function (params, callback) {
    setTimeout(function () {
        params.id = userData.length + 1;
        userData.push(params);
        callback(null, params)
    }, 1000)
};

let UserCreate = {
    template: '#user-create',
    data: function () {
        return {
            sending: false,
            user: this.defaultUser(),
            error: null
        }
    },

    created: function () {
    },

    methods: {
        defaultUser: function () {
            return {
                name: '',
                description: ''
            }
        },

        createUser: function () {
            if (this.user.name.trim() === '') {
                this.error = 'Nameは必須です';
                return
            }

            if (this.user.description.trim() === '') {
                this.error = 'Descriptionは必須です';
                return
            }

            postUser(this.user, (function (err, user) {
                this.sending = false;
                if (err) {
                    this.error = err.toString()
                } else {
                    this.error = null;
                    this.user = this.defaultUser();
                    alert('新規ユーザが登録されました');
                    this.$router.push('/users')
                }
            }).bind(this))
        }
    }
};

//Auth
let Auth = {
    login: function (email, pass, cb) {
        setTimeout(function () {
            if (email === 'vue@example.com' && pass === 'vue') {
                localStorage.token = Math.random().toString(36).substring(7);
                if (cb) {
                    cb(true)
                }
            } else {
                if (cb) {
                    cb(false)
                }
            }
        }, 0)
    },

    logout: function () {
        delete localStorage.token
    },

    loggedin: function () {
        return !!localStorage.token
    }
};

let Login = {
    template: '#login',
    data: function () {
        return {
            email: 'vue@example.com',
            password: '',
            error: false,
            required: true
        }
    },
    methods: {
        login: function () {
            Auth.login(this.email, this.password, (function (loggedin) {
                if (!loggedin) {
                    this.error = true
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            }).bind(this))
        }
    }
};

//ルータコンストラクタ
const router = new VueRouter({
    //ルート定義を配列で渡す
    routes: [
        {
            path: '/top',
            component: {
                template: '<div>トップページ</div>'
            }
        },
        {
            path: '/users',
            component: UserList
        },
        {
            path: '/users/new',
            component: UserCreate,
            beforeEnter: function (to, from, next) {
                if (!Auth.loggedin()) {
                    next({
                        path: '/login',
                        query: {
                            redirect: to.fullPath
                        }
                    })
                } else {
                    next()
                }
            }
        },
        {
            path: '/users/:userid',
            component: UserDetail
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/logout',
            beforeEnter: function (to, from, next) {
                Auth.logout();
                next('/top')
            }
        },
        {
            path: '*',
            redirect: '/top'
        }
    ]
});

let app = new Vue({
    el: '#app',
    data: {
        Auth: Auth
    },
    router: router
});
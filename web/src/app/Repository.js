import Subscription from "./Subscription";
import Subscriptions from "./Subscriptions";
import Users from "./Users";
import User from "./User";

class Repository {
    loadSubscriptions() {
        console.log(`[Repository] Loading subscriptions from localStorage`);
        const subscriptions = new Subscriptions();
        const serialized = localStorage.getItem('subscriptions');
        if (serialized === null) {
            return subscriptions;
        }
        try {
            JSON.parse(serialized).forEach(s => {
                const subscription = new Subscription(s.baseUrl, s.topic);
                subscription.addNotifications(s.notifications);
                subscriptions.add(subscription);
            });
            console.log(`[Repository] Loaded ${subscriptions.size()} subscription(s) from localStorage`);
            return subscriptions;
        } catch (e) {
            console.log(`[Repository] Unable to deserialize subscriptions: ${e.message}`);
            return subscriptions;
        }
    }

    saveSubscriptions(subscriptions) {
        console.log(`[Repository] Saving ${subscriptions.size()} subscription(s) to localStorage`);
        const serialized = JSON.stringify(subscriptions.map( (id, subscription) => {
            return {
                baseUrl: subscription.baseUrl,
                topic: subscription.topic,
                notifications: subscription.getNotifications(),
                last: subscription.last
            }
        }));
        localStorage.setItem('subscriptions', serialized);
    }

    loadUsers() {
        console.log(`[Repository] Loading users from localStorage`);
        const users = new Users();
        const serialized = localStorage.getItem('users');
        if (serialized === null) {
            return users;
        }
        try {
            JSON.parse(serialized).forEach(u => {
                users.add(new User(u.baseUrl, u.username, u.password));
            });
            return users;
        } catch (e) {
            console.log(`[Repository] Unable to deserialize users: ${e.message}`);
            return users;
        }
    }

    saveUsers(users) {
        console.log(`[Repository] Saving users to localStorage`);
        const serialized = JSON.stringify(users.map(user => {
            return {
                baseUrl: user.baseUrl,
                username: user.username,
                password: user.password
            }
        }));
        localStorage.setItem('users', serialized);
    }
}

const repository = new Repository();
export default repository;

import { EventEmitter } from "events";

class DomainEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }

    /**
     * @param {string} eventName 
     * @param {Object} payload 
     */
    publish(eventName, payload) {
        console.log(`[DomainEventBus] Event Published: ${eventName}`, payload);
        this.emit(eventName, {
            eventName,
            payload,
            timestamp: new Date().toISOString(),
        });
    }
}

export const eventBus = new DomainEventBus();

export const DOMAIN_EVENTS = {
    USER_REGISTERED: "user.registered",
    POST_CREATED: "post.created",
    POST_LIKED: "post.liked",
    COMMENT_ADDED: "comment.added",
    FRIEND_REQUEST_SENT: "friend.request_sent",
};

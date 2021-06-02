package lt.kietekai.football.utils;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;

public class MessageAsHandler <T> implements Handler<AsyncResult<T>> {
    private final Message<?> message;

    public MessageAsHandler(Message<?> message) {
        this.message = message;
    }

    @Override
    public void handle(AsyncResult<T> result) {
        if (result.succeeded()) {
            message.reply(result.result());
        } else {
            if (result.cause() == null) {
                message.fail(500, null);
            } else {
                message.fail(500, result.cause().getMessage());
            }
        }
    }
}

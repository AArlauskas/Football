package lt.kietekai.football.utils;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class MessageAsHandler <T> implements Handler<AsyncResult<T>> {
    private static final Logger log = LogManager.getLogger("eventBus");
    private final Message<?> message;

    public MessageAsHandler(Message<?> message) {
        this.message = message;
    }

    @Override
    public void handle(AsyncResult<T> result) {
        if (result.succeeded()) {
            message.reply(result.result());
        } else {
            log.error("Replying with an error", result.cause());
            if (result.cause() == null) {
                message.fail(500, null);
            } else {

                message.fail(500, result.cause().getMessage());
            }
        }
    }
}

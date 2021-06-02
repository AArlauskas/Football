package lt.kietekai.football.utils;

import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.MessageCodec;

import java.util.UUID;

public class SimpleCodec<T> implements MessageCodec<T, T> {
    private final String name = UUID.randomUUID().toString();

    @Override
    public void encodeToWire(Buffer buffer, T t) {
        throw new IllegalStateException("not implemented");
    }

    @Override
    public T decodeFromWire(int i, Buffer buffer) {
        throw new IllegalStateException("not implemented");
    }

    @Override
    public T transform(T t) {
        return t;
    }

    @Override
    public String name() {
        return "simple-codec-" + name;
    }

    @Override
    public byte systemCodecID() {
        return -1;
    }
}

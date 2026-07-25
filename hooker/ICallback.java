package nep.timeline.freezer.core.reflect.cross.callback;

import androidx.annotation.NonNull;

import java.lang.reflect.Member;

public interface ICallback {
    interface Replacement {
        Object getThisObject();

        Object[] getArgs();

        void setArgs(Object[] args);

        Object invokeOriginalMethod() throws Throwable;

        Object invokeOriginalMethod(Object[] args) throws Throwable;

        Object invokeOriginalMethodWith(Object thisObject) throws Throwable;

        Object invokeOriginalMethodWith(Object thisObject, Object[] args) throws Throwable;

        Member getMember();
    }

    interface Before {
        Object getThisObject();

        Object[] getArgs();

        void setArgs(Object[] args);

        Object invokeOriginalMethod() throws Throwable;

        Object invokeOriginalMethod(Object[] args) throws Throwable;

        Object invokeOriginalMethodWith(Object thisObject) throws Throwable;

        Object invokeOriginalMethodWith(Object thisObject, Object[] args) throws Throwable;

        Member getMember();

        void returnAndSkip(Object result);

        void throwAndSkip(@NonNull Throwable result);

        boolean isSkipped();

        Object getResult();

        boolean isThrown();

        Throwable getThrowable();
    }

    interface After {
        Object getThisObject();

        Object[] getArgs();

        Object getResult();

        Throwable getThrowable();

        void setResult(Object result);

        void setThrowable(Throwable throwable);
    }
}

import { onUnmounted, ref } from 'vue';
export function useTimer() {
    const secondsLeft = ref(0);
    const isRunning = ref(false);
    let intervalId = null;
    function start(durationSeconds, onExpire) {
        stop();
        secondsLeft.value = durationSeconds;
        isRunning.value = true;
        intervalId = setInterval(() => {
            secondsLeft.value--;
            if (secondsLeft.value <= 0) {
                stop();
                onExpire();
            }
        }, 1000);
    }
    function startFromTimestamp(expiresAt, onExpire) {
        stop();
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        if (remaining <= 0) {
            secondsLeft.value = 0;
            isRunning.value = false;
            onExpire();
            return;
        }
        secondsLeft.value = remaining;
        isRunning.value = true;
        intervalId = setInterval(() => {
            secondsLeft.value--;
            if (secondsLeft.value <= 0) {
                stop();
                onExpire();
            }
        }, 1000);
    }
    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isRunning.value = false;
    }
    onUnmounted(() => {
        stop();
    });
    return {
        secondsLeft,
        isRunning,
        start,
        startFromTimestamp,
        stop,
    };
}

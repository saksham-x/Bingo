import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { ref as dbRef, onValue, update, off, } from 'firebase/database';
import { useRoom } from '@/composables/useRoom';
const route = useRoute();
const router = useRouter();
const roomCode = route.params.code;
const { generateBoard } = useRoom();
const roomData = ref(null);
const players = ref({});
const loading = ref(true);
const resetting = ref(false);
const currentUserId = computed(() => auth.currentUser?.uid || '');
const isHost = computed(() => roomData.value?.hostId === currentUserId.value);
const gridSize = computed(() => roomData.value?.gridSize || 5);
// Winner info
const winnerId = computed(() => roomData.value?.winnerId || '');
const winner = computed(() => {
    if (!winnerId.value)
        return null;
    return {
        uid: winnerId.value,
        ...players.value[winnerId.value],
    };
});
const isWinnerMe = computed(() => winnerId.value === currentUserId.value);
// BINGO letters based on grid size
const bingoLetters = computed(() => {
    const all = ['B', 'I', 'N', 'G', 'O'];
    return all.slice(0, gridSize.value);
});
// Sorted player standings: winner first, then by letters earned (desc)
const standings = computed(() => {
    const list = Object.entries(players.value).map(([uid, data]) => ({
        uid,
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL || '',
        lettersEarned: data.lettersEarned || [],
        isWinner: data.isWinner || false,
        markedCount: (data.markedNumbers || []).length,
    }));
    // Sort: winner first, then by letters count desc
    list.sort((a, b) => {
        if (a.isWinner && !b.isWinner)
            return -1;
        if (!a.isWinner && b.isWinner)
            return 1;
        return b.lettersEarned.length - a.lettersEarned.length;
    });
    return list;
});
// Total numbers called
const totalCalled = computed(() => (roomData.value?.calledNumbers || []).length);
// Firebase listener
let roomListener = null;
onMounted(() => {
    const roomRef = dbRef(db, `rooms/${roomCode}`);
    roomListener = onValue(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
            router.push('/lobby');
            return;
        }
        const data = snapshot.val();
        const { players: playersData, ...room } = data;
        roomData.value = room;
        players.value = playersData || {};
        // If room was reset back to waiting, go to waiting room
        if (room.status === 'waiting') {
            router.push(`/room/${roomCode}`);
        }
        loading.value = false;
    });
});
onUnmounted(() => {
    if (roomListener) {
        off(dbRef(db, `rooms/${roomCode}`));
    }
});
// Play Again: reset room back to waiting state
async function playAgain() {
    if (!isHost.value)
        return;
    resetting.value = true;
    try {
        const updates = {
            [`rooms/${roomCode}/status`]: 'waiting',
            [`rooms/${roomCode}/turnOrder`]: [],
            [`rooms/${roomCode}/currentTurnIndex`]: 0,
            [`rooms/${roomCode}/turnExpiresAt`]: 0,
            [`rooms/${roomCode}/calledNumbers`]: [],
            [`rooms/${roomCode}/winnerId`]: null,
        };
        // Reset each player's game state with a fresh board
        for (const uid of Object.keys(players.value)) {
            updates[`rooms/${roomCode}/players/${uid}/markedNumbers`] = [];
            updates[`rooms/${roomCode}/players/${uid}/lettersEarned`] = [];
            updates[`rooms/${roomCode}/players/${uid}/isWinner`] = false;
            updates[`rooms/${roomCode}/players/${uid}/board`] = generateBoard(gridSize.value);
        }
        await update(dbRef(db), updates);
        // Navigation handled by the watcher above when status changes to 'waiting'
    }
    catch (err) {
        console.error('Failed to reset room:', err);
    }
    finally {
        resetting.value = false;
    }
}
// Leave: go back to lobby
function leaveLobby() {
    router.push('/lobby');
}
// Rank suffix
function getRankSuffix(index) {
    const rank = index + 1;
    if (rank === 1)
        return '1st';
    if (rank === 2)
        return '2nd';
    if (rank === 3)
        return '3rd';
    return `${rank}th`;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.vContainer | typeof __VLS_components.VContainer | typeof __VLS_components.vContainer | typeof __VLS_components.VContainer} */
vContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "py-6 d-flex flex-column align-center" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "py-6 d-flex flex-column align-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-center align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_7;
    /** @ts-ignore @type {typeof __VLS_components.vProgressCircular | typeof __VLS_components.VProgressCircular} */
    vProgressCircular;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        indeterminate: true,
        color: "primary",
        size: "48",
    }));
    const __VLS_9 = __VLS_8({
        indeterminate: true,
        color: "primary",
        size: "48",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
else {
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        width: "520",
        ...{ class: "mb-6 text-center pa-8" },
        elevation: "8",
        rounded: "xl",
    }));
    const __VLS_14 = __VLS_13({
        width: "520",
        ...{ class: "mb-6 text-center pa-8" },
        elevation: "8",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['pa-8']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    let __VLS_18;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        size: "72",
        color: "warning",
        ...{ class: "mb-4" },
    }));
    const __VLS_20 = __VLS_19({
        size: "72",
        color: "warning",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    // @ts-ignore
    [loading,];
    var __VLS_21;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h4 font-weight-bold mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    (__VLS_ctx.isWinnerMe ? 'You Win!' : `${__VLS_ctx.winner?.displayName} Wins!`);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-body-1 text-medium-emphasis mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    (__VLS_ctx.isWinnerMe ? 'Congratulations! You completed BINGO first!' : 'Better luck next time!');
    if (__VLS_ctx.winner) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex flex-column align-center mb-6" },
        });
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
        let __VLS_24;
        /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
        vAvatar;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            size: "80",
            ...{ class: "mb-3" },
            ...{ style: {} },
        }));
        const __VLS_26 = __VLS_25({
            size: "80",
            ...{ class: "mb-3" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
        const { default: __VLS_29 } = __VLS_27.slots;
        let __VLS_30;
        /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
        vImg;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            src: (__VLS_ctx.winner.photoURL || ''),
        }));
        const __VLS_32 = __VLS_31({
            src: (__VLS_ctx.winner.photoURL || ''),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        // @ts-ignore
        [isWinnerMe, isWinnerMe, winner, winner, winner,];
        var __VLS_27;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex ga-2 mt-2" },
        });
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        for (const [letter] of __VLS_vFor((__VLS_ctx.bingoLetters))) {
            let __VLS_35;
            /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
            vChip;
            // @ts-ignore
            const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
                key: (letter),
                color: "success",
                variant: "flat",
                size: "large",
                ...{ class: "font-weight-bold" },
                ...{ style: {} },
            }));
            const __VLS_37 = __VLS_36({
                key: (letter),
                color: "success",
                variant: "flat",
                size: "large",
                ...{ class: "font-weight-bold" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_36));
            /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
            const { default: __VLS_40 } = __VLS_38.slots;
            (letter);
            // @ts-ignore
            [bingoLetters,];
            var __VLS_38;
            // @ts-ignore
            [];
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex justify-center ga-6 text-medium-emphasis mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['ga-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h6 font-weight-bold text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
    (__VLS_ctx.totalCalled);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-caption" },
    });
    /** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h6 font-weight-bold text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
    (__VLS_ctx.standings.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-caption" },
    });
    /** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h6 font-weight-bold text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
    (__VLS_ctx.gridSize);
    (__VLS_ctx.gridSize);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-caption" },
    });
    /** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
    // @ts-ignore
    [totalCalled, standings, gridSize, gridSize,];
    var __VLS_15;
    let __VLS_41;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        width: "520",
        elevation: "4",
        rounded: "xl",
        ...{ class: "mb-6" },
    }));
    const __VLS_43 = __VLS_42({
        width: "520",
        elevation: "4",
        rounded: "xl",
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    const { default: __VLS_46 } = __VLS_44.slots;
    let __VLS_47;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ class: "pa-4" },
    }));
    const __VLS_49 = __VLS_48({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_52 } = __VLS_50.slots;
    let __VLS_53;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ class: "mr-2" },
    }));
    const __VLS_55 = __VLS_54({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_58 } = __VLS_56.slots;
    // @ts-ignore
    [];
    var __VLS_56;
    // @ts-ignore
    [];
    var __VLS_50;
    let __VLS_59;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
    const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    /** @ts-ignore @type {typeof __VLS_components.vList | typeof __VLS_components.VList | typeof __VLS_components.vList | typeof __VLS_components.VList} */
    vList;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    for (const [player, index] of __VLS_vFor((__VLS_ctx.standings))) {
        let __VLS_70;
        /** @ts-ignore @type {typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem} */
        vListItem;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
            key: (player.uid),
            ...{ class: ({
                    'bg-warning-darken-2': player.isWinner,
                }) },
        }));
        const __VLS_72 = __VLS_71({
            key: (player.uid),
            ...{ class: ({
                    'bg-warning-darken-2': player.isWinner,
                }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        /** @type {__VLS_StyleScopedClasses['bg-warning-darken-2']} */ ;
        const { default: __VLS_75 } = __VLS_73.slots;
        {
            const { prepend: __VLS_76 } = __VLS_73.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "d-flex align-center mr-3" },
            });
            /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
            let __VLS_77;
            /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
            vChip;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
                color: (index === 0 ? 'warning' : index === 1 ? 'grey' : index === 2 ? 'brown' : 'default'),
                variant: (index < 3 ? 'flat' : 'tonal'),
                size: "small",
                ...{ class: "font-weight-bold mr-3" },
                ...{ style: {} },
            }));
            const __VLS_79 = __VLS_78({
                color: (index === 0 ? 'warning' : index === 1 ? 'grey' : index === 2 ? 'brown' : 'default'),
                variant: (index < 3 ? 'flat' : 'tonal'),
                size: "small",
                ...{ class: "font-weight-bold mr-3" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
            const { default: __VLS_82 } = __VLS_80.slots;
            (__VLS_ctx.getRankSuffix(index));
            // @ts-ignore
            [standings, getRankSuffix,];
            var __VLS_80;
            let __VLS_83;
            /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
            vAvatar;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                size: "36",
            }));
            const __VLS_85 = __VLS_84({
                size: "36",
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            const { default: __VLS_88 } = __VLS_86.slots;
            let __VLS_89;
            /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
            vImg;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
                src: (player.photoURL || ''),
            }));
            const __VLS_91 = __VLS_90({
                src: (player.photoURL || ''),
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            // @ts-ignore
            [];
            var __VLS_86;
            // @ts-ignore
            [];
        }
        let __VLS_94;
        /** @ts-ignore @type {typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle} */
        vListItemTitle;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            ...{ class: "font-weight-medium" },
        }));
        const __VLS_96 = __VLS_95({
            ...{ class: "font-weight-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        /** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
        const { default: __VLS_99 } = __VLS_97.slots;
        (player.displayName);
        if (player.uid === __VLS_ctx.currentUserId) {
            let __VLS_100;
            /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
            vChip;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                size: "x-small",
                color: "info",
                variant: "tonal",
                ...{ class: "ml-1" },
            }));
            const __VLS_102 = __VLS_101({
                size: "x-small",
                color: "info",
                variant: "tonal",
                ...{ class: "ml-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
            const { default: __VLS_105 } = __VLS_103.slots;
            // @ts-ignore
            [currentUserId,];
            var __VLS_103;
        }
        // @ts-ignore
        [];
        var __VLS_97;
        let __VLS_106;
        /** @ts-ignore @type {typeof __VLS_components.vListItemSubtitle | typeof __VLS_components.VListItemSubtitle | typeof __VLS_components.vListItemSubtitle | typeof __VLS_components.VListItemSubtitle} */
        vListItemSubtitle;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
        const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
        const { default: __VLS_111 } = __VLS_109.slots;
        (player.markedCount);
        // @ts-ignore
        [];
        var __VLS_109;
        {
            const { append: __VLS_112 } = __VLS_73.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "d-flex ga-1" },
            });
            /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
            for (const [letter] of __VLS_vFor((__VLS_ctx.bingoLetters))) {
                let __VLS_113;
                /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
                vChip;
                // @ts-ignore
                const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
                    key: (letter),
                    color: (player.lettersEarned.includes(letter) ? 'success' : 'default'),
                    variant: (player.lettersEarned.includes(letter) ? 'flat' : 'outlined'),
                    size: "x-small",
                    ...{ class: "font-weight-bold" },
                }));
                const __VLS_115 = __VLS_114({
                    key: (letter),
                    color: (player.lettersEarned.includes(letter) ? 'success' : 'default'),
                    variant: (player.lettersEarned.includes(letter) ? 'flat' : 'outlined'),
                    size: "x-small",
                    ...{ class: "font-weight-bold" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_114));
                /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
                const { default: __VLS_118 } = __VLS_116.slots;
                (letter);
                // @ts-ignore
                [bingoLetters,];
                var __VLS_116;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_73;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_44;
    let __VLS_119;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
        width: "520",
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_121 = __VLS_120({
        width: "520",
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    const { default: __VLS_124 } = __VLS_122.slots;
    let __VLS_125;
    /** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
    vCardText;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        ...{ class: "pa-4 d-flex ga-4" },
    }));
    const __VLS_127 = __VLS_126({
        ...{ class: "pa-4 d-flex ga-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
    const { default: __VLS_130 } = __VLS_128.slots;
    if (__VLS_ctx.isHost) {
        let __VLS_131;
        /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
        vBtn;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
            ...{ 'onClick': {} },
            color: "success",
            size: "large",
            variant: "flat",
            ...{ class: "flex-grow-1" },
            loading: (__VLS_ctx.resetting),
        }));
        const __VLS_133 = __VLS_132({
            ...{ 'onClick': {} },
            color: "success",
            size: "large",
            variant: "flat",
            ...{ class: "flex-grow-1" },
            loading: (__VLS_ctx.resetting),
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        let __VLS_136;
        const __VLS_137 = ({ click: {} },
            { onClick: (__VLS_ctx.playAgain) });
        /** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
        const { default: __VLS_138 } = __VLS_134.slots;
        let __VLS_139;
        /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
        vIcon;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
            start: true,
        }));
        const __VLS_141 = __VLS_140({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        const { default: __VLS_144 } = __VLS_142.slots;
        // @ts-ignore
        [isHost, resetting, playAgain,];
        var __VLS_142;
        // @ts-ignore
        [];
        var __VLS_134;
        var __VLS_135;
    }
    if (!__VLS_ctx.isHost) {
        let __VLS_145;
        /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
        vBtn;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
            color: "grey",
            size: "large",
            variant: "tonal",
            ...{ class: "flex-grow-1" },
            disabled: true,
        }));
        const __VLS_147 = __VLS_146({
            color: "grey",
            size: "large",
            variant: "tonal",
            ...{ class: "flex-grow-1" },
            disabled: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        /** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
        const { default: __VLS_150 } = __VLS_148.slots;
        let __VLS_151;
        /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
        vIcon;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
            start: true,
        }));
        const __VLS_153 = __VLS_152({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        const { default: __VLS_156 } = __VLS_154.slots;
        // @ts-ignore
        [isHost,];
        var __VLS_154;
        // @ts-ignore
        [];
        var __VLS_148;
    }
    let __VLS_157;
    /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
    vBtn;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
        color: "default",
        size: "large",
        variant: "outlined",
        ...{ class: "flex-grow-1" },
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        color: "default",
        size: "large",
        variant: "outlined",
        ...{ class: "flex-grow-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_162;
    const __VLS_163 = ({ click: {} },
        { onClick: (__VLS_ctx.leaveLobby) });
    /** @type {__VLS_StyleScopedClasses['flex-grow-1']} */ ;
    const { default: __VLS_164 } = __VLS_160.slots;
    let __VLS_165;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        start: true,
    }));
    const __VLS_167 = __VLS_166({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    const { default: __VLS_170 } = __VLS_168.slots;
    // @ts-ignore
    [leaveLobby,];
    var __VLS_168;
    // @ts-ignore
    [];
    var __VLS_160;
    var __VLS_161;
    // @ts-ignore
    [];
    var __VLS_128;
    // @ts-ignore
    [];
    var __VLS_122;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

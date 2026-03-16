import { onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGame } from '@/composables/useGame';
import { useTimer } from '@/composables/useTimer';
const route = useRoute();
const router = useRouter();
const roomCode = route.params.code;
const game = useGame(roomCode);
const timer = useTimer();
// Subscribe to game state
onMounted(() => {
    game.subscribe();
});
onUnmounted(() => {
    game.unsubscribe();
    timer.stop();
});
// Watch for game status changes
watch(() => game.status.value, (newStatus) => {
    if (newStatus === 'finished') {
        timer.stop();
        router.push(`/result/${roomCode}`);
    }
});
// Watch for turn changes → restart timer
watch(() => game.turnExpiresAt.value, (newExpiresAt) => {
    if (!newExpiresAt || game.status.value !== 'playing')
        return;
    timer.startFromTimestamp(newExpiresAt, () => {
        // Only the active player auto-selects
        if (game.isMyTurn.value) {
            game.autoSelectNumber();
        }
    });
});
// Is a number callable? (my turn + not already called)
function isCallable(num) {
    return game.isMyTurn.value && !game.calledNumbers.value.includes(num);
}
// Is a number marked on my board?
function isMarked(num) {
    return game.myMarkedNumbers.value.includes(num);
}
// Handle clicking a number on my board
async function handleCellClick(num) {
    if (!isCallable(num))
        return;
    await game.callNumber(num);
}
// Active player name
const activePlayerName = computed(() => {
    const player = game.players.value[game.activePlayerId.value];
    if (!player)
        return '';
    if (game.activePlayerId.value === game.currentUserId.value)
        return 'Your';
    return `${player.displayName}'s`;
});
// BINGO letters for display based on grid size
const bingoLetters = computed(() => {
    const all = ['B', 'I', 'N', 'G', 'O'];
    return all.slice(0, game.gridSize.value);
});
// Get letters earned for any player
function getPlayerLetters(uid) {
    return game.players.value[uid]?.lettersEarned || [];
}
// Timer color
const timerColor = computed(() => {
    if (timer.secondsLeft.value <= 5)
        return 'error';
    if (timer.secondsLeft.value <= 10)
        return 'warning';
    return 'primary';
});
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
    ...{ class: "py-4" },
    fluid: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "py-4" },
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.game.loading.value) {
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
        ...{ class: "mb-4 pa-4" },
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "mb-4 pa-4" },
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center flex-wrap ga-4" },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (__VLS_ctx.game.players.value[__VLS_ctx.game.activePlayerId.value]) {
        let __VLS_18;
        /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
        vAvatar;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            size: "40",
            ...{ class: "mr-3" },
        }));
        const __VLS_20 = __VLS_19({
            size: "40",
            ...{ class: "mr-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        /** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
        const { default: __VLS_23 } = __VLS_21.slots;
        let __VLS_24;
        /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
        vImg;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            src: (__VLS_ctx.game.players.value[__VLS_ctx.game.activePlayerId.value]?.photoURL || ''),
        }));
        const __VLS_26 = __VLS_25({
            src: (__VLS_ctx.game.players.value[__VLS_ctx.game.activePlayerId.value]?.photoURL || ''),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        // @ts-ignore
        [game, game, game, game, game,];
        var __VLS_21;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h6 font-weight-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    (__VLS_ctx.activePlayerName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-body-2 text-medium-emphasis" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
    (__VLS_ctx.game.isMyTurn.value ? 'Click a number on your board!' : 'Waiting...');
    let __VLS_29;
    /** @ts-ignore @type {typeof __VLS_components.vSpacer | typeof __VLS_components.VSpacer} */
    vSpacer;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
    vChip;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        color: (__VLS_ctx.timerColor),
        size: "x-large",
        variant: "tonal",
        ...{ class: "font-weight-bold" },
        ...{ style: {} },
    }));
    const __VLS_36 = __VLS_35({
        color: (__VLS_ctx.timerColor),
        size: "x-large",
        variant: "tonal",
        ...{ class: "font-weight-bold" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    const { default: __VLS_39 } = __VLS_37.slots;
    let __VLS_40;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        start: true,
    }));
    const __VLS_42 = __VLS_41({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const { default: __VLS_45 } = __VLS_43.slots;
    // @ts-ignore
    [game, activePlayerName, timerColor,];
    var __VLS_43;
    (__VLS_ctx.timer.secondsLeft.value);
    // @ts-ignore
    [timer,];
    var __VLS_37;
    if (__VLS_ctx.game.isMyTurn.value) {
        let __VLS_46;
        /** @ts-ignore @type {typeof __VLS_components.vAlert | typeof __VLS_components.VAlert | typeof __VLS_components.vAlert | typeof __VLS_components.VAlert} */
        vAlert;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            type: "info",
            variant: "tonal",
            density: "compact",
            ...{ class: "mt-3" },
        }));
        const __VLS_48 = __VLS_47({
            type: "info",
            variant: "tonal",
            density: "compact",
            ...{ class: "mt-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
        const { default: __VLS_51 } = __VLS_49.slots;
        // @ts-ignore
        [game,];
        var __VLS_49;
    }
    // @ts-ignore
    [];
    var __VLS_15;
    let __VLS_52;
    /** @ts-ignore @type {typeof __VLS_components.vRow | typeof __VLS_components.VRow | typeof __VLS_components.vRow | typeof __VLS_components.VRow} */
    vRow;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_57 } = __VLS_55.slots;
    let __VLS_58;
    /** @ts-ignore @type {typeof __VLS_components.vCol | typeof __VLS_components.VCol | typeof __VLS_components.vCol | typeof __VLS_components.VCol} */
    vCol;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        cols: "12",
        md: "7",
    }));
    const __VLS_60 = __VLS_59({
        cols: "12",
        md: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    let __VLS_64;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_66 = __VLS_65({
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ class: "d-flex align-center pa-4" },
    }));
    const __VLS_72 = __VLS_71({
        ...{ class: "d-flex align-center pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ class: "mr-2" },
    }));
    const __VLS_78 = __VLS_77({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_81 } = __VLS_79.slots;
    // @ts-ignore
    [];
    var __VLS_79;
    let __VLS_82;
    /** @ts-ignore @type {typeof __VLS_components.vSpacer | typeof __VLS_components.VSpacer} */
    vSpacer;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({}));
    const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex ga-1" },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
    for (const [letter] of __VLS_vFor((__VLS_ctx.bingoLetters))) {
        let __VLS_87;
        /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
        vChip;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            key: (letter),
            color: (__VLS_ctx.game.myLetters.value.includes(letter) ? 'success' : 'default'),
            variant: (__VLS_ctx.game.myLetters.value.includes(letter) ? 'flat' : 'outlined'),
            size: "small",
            ...{ class: "font-weight-bold" },
        }));
        const __VLS_89 = __VLS_88({
            key: (letter),
            color: (__VLS_ctx.game.myLetters.value.includes(letter) ? 'success' : 'default'),
            variant: (__VLS_ctx.game.myLetters.value.includes(letter) ? 'flat' : 'outlined'),
            size: "small",
            ...{ class: "font-weight-bold" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
        const { default: __VLS_92 } = __VLS_90.slots;
        (letter);
        // @ts-ignore
        [game, game, bingoLetters,];
        var __VLS_90;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_73;
    let __VLS_93;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({}));
    const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    /** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
    vCardText;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ class: "pa-4" },
    }));
    const __VLS_100 = __VLS_99({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_103 } = __VLS_101.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: ({
                display: 'grid',
                gridTemplateColumns: `repeat(${__VLS_ctx.game.gridSize.value}, 1fr)`,
                gap: '8px',
                maxWidth: __VLS_ctx.game.gridSize.value <= 3 ? '320px' : '450px',
                margin: '0 auto',
            }) },
    });
    for (const [num, idx] of __VLS_vFor((__VLS_ctx.game.myBoard.value.flat()))) {
        let __VLS_104;
        /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
        vCard;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            ...{ 'onClick': {} },
            key: (idx),
            ...{ class: "d-flex align-center justify-center" },
            ...{ style: ({
                    aspectRatio: '1',
                    cursor: __VLS_ctx.isCallable(num) ? 'pointer' : 'default',
                    fontSize: __VLS_ctx.game.gridSize.value <= 3 ? '1.5rem' : '1.2rem',
                    fontWeight: 'bold',
                    opacity: __VLS_ctx.isMarked(num) ? 1 : 0.9,
                    transition: 'all 0.2s ease',
                }) },
            color: (__VLS_ctx.isMarked(num) ? 'primary' : 'surface-variant'),
            variant: (__VLS_ctx.isMarked(num) ? 'flat' : 'tonal'),
            elevation: (__VLS_ctx.isCallable(num) ? 4 : 1),
            rounded: "lg",
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onClick': {} },
            key: (idx),
            ...{ class: "d-flex align-center justify-center" },
            ...{ style: ({
                    aspectRatio: '1',
                    cursor: __VLS_ctx.isCallable(num) ? 'pointer' : 'default',
                    fontSize: __VLS_ctx.game.gridSize.value <= 3 ? '1.5rem' : '1.2rem',
                    fontWeight: 'bold',
                    opacity: __VLS_ctx.isMarked(num) ? 1 : 0.9,
                    transition: 'all 0.2s ease',
                }) },
            color: (__VLS_ctx.isMarked(num) ? 'primary' : 'surface-variant'),
            variant: (__VLS_ctx.isMarked(num) ? 'flat' : 'tonal'),
            elevation: (__VLS_ctx.isCallable(num) ? 4 : 1),
            rounded: "lg",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_109;
        const __VLS_110 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.game.loading.value))
                        return;
                    __VLS_ctx.handleCellClick(num);
                    // @ts-ignore
                    [game, game, game, game, isCallable, isCallable, isMarked, isMarked, isMarked, handleCellClick,];
                } });
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_111 } = __VLS_107.slots;
        if (__VLS_ctx.isMarked(num)) {
            let __VLS_112;
            /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
            vIcon;
            // @ts-ignore
            const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                size: "14",
                ...{ class: "mr-1" },
            }));
            const __VLS_114 = __VLS_113({
                size: "14",
                ...{ class: "mr-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_113));
            /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
            const { default: __VLS_117 } = __VLS_115.slots;
            // @ts-ignore
            [isMarked,];
            var __VLS_115;
        }
        (num);
        // @ts-ignore
        [];
        var __VLS_107;
        var __VLS_108;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_101;
    // @ts-ignore
    [];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_61;
    let __VLS_118;
    /** @ts-ignore @type {typeof __VLS_components.vCol | typeof __VLS_components.VCol | typeof __VLS_components.vCol | typeof __VLS_components.VCol} */
    vCol;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        cols: "12",
        md: "5",
    }));
    const __VLS_120 = __VLS_119({
        cols: "12",
        md: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    const { default: __VLS_123 } = __VLS_121.slots;
    let __VLS_124;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        elevation: "4",
        rounded: "xl",
        ...{ class: "mb-4" },
    }));
    const __VLS_126 = __VLS_125({
        elevation: "4",
        rounded: "xl",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_129 } = __VLS_127.slots;
    let __VLS_130;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        ...{ class: "pa-4" },
    }));
    const __VLS_132 = __VLS_131({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_135 } = __VLS_133.slots;
    let __VLS_136;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        ...{ class: "mr-2" },
    }));
    const __VLS_138 = __VLS_137({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_141 } = __VLS_139.slots;
    // @ts-ignore
    [];
    var __VLS_139;
    // @ts-ignore
    [];
    var __VLS_133;
    let __VLS_142;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({}));
    const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_147;
    /** @ts-ignore @type {typeof __VLS_components.vList | typeof __VLS_components.VList | typeof __VLS_components.vList | typeof __VLS_components.VList} */
    vList;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        density: "compact",
    }));
    const __VLS_149 = __VLS_148({
        density: "compact",
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    const { default: __VLS_152 } = __VLS_150.slots;
    for (const [player] of __VLS_vFor((__VLS_ctx.game.playerList.value))) {
        let __VLS_153;
        /** @ts-ignore @type {typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem} */
        vListItem;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
            key: (player.uid),
            ...{ class: ({ 'bg-primary-darken-2': player.uid === __VLS_ctx.game.activePlayerId.value }) },
        }));
        const __VLS_155 = __VLS_154({
            key: (player.uid),
            ...{ class: ({ 'bg-primary-darken-2': player.uid === __VLS_ctx.game.activePlayerId.value }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        /** @type {__VLS_StyleScopedClasses['bg-primary-darken-2']} */ ;
        const { default: __VLS_158 } = __VLS_156.slots;
        {
            const { prepend: __VLS_159 } = __VLS_156.slots;
            let __VLS_160;
            /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
            vAvatar;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
                size: "32",
                ...{ class: "mr-3" },
            }));
            const __VLS_162 = __VLS_161({
                size: "32",
                ...{ class: "mr-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            /** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
            const { default: __VLS_165 } = __VLS_163.slots;
            let __VLS_166;
            /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
            vImg;
            // @ts-ignore
            const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
                src: (player.photoURL || ''),
            }));
            const __VLS_168 = __VLS_167({
                src: (player.photoURL || ''),
            }, ...__VLS_functionalComponentArgsRest(__VLS_167));
            // @ts-ignore
            [game, game,];
            var __VLS_163;
            // @ts-ignore
            [];
        }
        let __VLS_171;
        /** @ts-ignore @type {typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle} */
        vListItemTitle;
        // @ts-ignore
        const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
            ...{ class: "d-flex align-center" },
        }));
        const __VLS_173 = __VLS_172({
            ...{ class: "d-flex align-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_172));
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        const { default: __VLS_176 } = __VLS_174.slots;
        (player.displayName);
        if (player.uid === __VLS_ctx.game.activePlayerId.value) {
            let __VLS_177;
            /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
            vIcon;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
                size: "16",
                color: "warning",
                ...{ class: "ml-1" },
            }));
            const __VLS_179 = __VLS_178({
                size: "16",
                color: "warning",
                ...{ class: "ml-1" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
            const { default: __VLS_182 } = __VLS_180.slots;
            // @ts-ignore
            [game,];
            var __VLS_180;
        }
        // @ts-ignore
        [];
        var __VLS_174;
        {
            const { append: __VLS_183 } = __VLS_156.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "d-flex ga-1" },
            });
            /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['ga-1']} */ ;
            for (const [letter] of __VLS_vFor((__VLS_ctx.bingoLetters))) {
                let __VLS_184;
                /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
                vChip;
                // @ts-ignore
                const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
                    key: (letter),
                    color: (__VLS_ctx.getPlayerLetters(player.uid).includes(letter) ? 'success' : 'default'),
                    variant: (__VLS_ctx.getPlayerLetters(player.uid).includes(letter) ? 'flat' : 'outlined'),
                    size: "x-small",
                    ...{ class: "font-weight-bold" },
                }));
                const __VLS_186 = __VLS_185({
                    key: (letter),
                    color: (__VLS_ctx.getPlayerLetters(player.uid).includes(letter) ? 'success' : 'default'),
                    variant: (__VLS_ctx.getPlayerLetters(player.uid).includes(letter) ? 'flat' : 'outlined'),
                    size: "x-small",
                    ...{ class: "font-weight-bold" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_185));
                /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
                const { default: __VLS_189 } = __VLS_187.slots;
                (letter);
                // @ts-ignore
                [bingoLetters, getPlayerLetters, getPlayerLetters,];
                var __VLS_187;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_156;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_150;
    // @ts-ignore
    [];
    var __VLS_127;
    let __VLS_190;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_192 = __VLS_191({
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    const { default: __VLS_195 } = __VLS_193.slots;
    let __VLS_196;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
        ...{ class: "pa-4" },
    }));
    const __VLS_198 = __VLS_197({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_201 } = __VLS_199.slots;
    let __VLS_202;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
        ...{ class: "mr-2" },
    }));
    const __VLS_204 = __VLS_203({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_207 } = __VLS_205.slots;
    // @ts-ignore
    [];
    var __VLS_205;
    (__VLS_ctx.game.calledNumbers.value.length);
    // @ts-ignore
    [game,];
    var __VLS_199;
    let __VLS_208;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({}));
    const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
    let __VLS_213;
    /** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
    vCardText;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        ...{ class: "pa-4" },
    }));
    const __VLS_215 = __VLS_214({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_218 } = __VLS_216.slots;
    if (__VLS_ctx.game.calledNumbers.value.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-medium-emphasis text-center" },
        });
        /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "d-flex flex-wrap ga-2" },
        });
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ga-2']} */ ;
        for (const [num, idx] of __VLS_vFor(([...__VLS_ctx.game.calledNumbers.value].reverse()))) {
            let __VLS_219;
            /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
            vChip;
            // @ts-ignore
            const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
                key: (idx),
                color: (idx === 0 ? 'primary' : 'default'),
                variant: (idx === 0 ? 'flat' : 'tonal'),
                size: "small",
            }));
            const __VLS_221 = __VLS_220({
                key: (idx),
                color: (idx === 0 ? 'primary' : 'default'),
                variant: (idx === 0 ? 'flat' : 'tonal'),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_220));
            const { default: __VLS_224 } = __VLS_222.slots;
            (num);
            // @ts-ignore
            [game, game,];
            var __VLS_222;
            // @ts-ignore
            [];
        }
    }
    // @ts-ignore
    [];
    var __VLS_216;
    // @ts-ignore
    [];
    var __VLS_193;
    // @ts-ignore
    [];
    var __VLS_121;
    // @ts-ignore
    [];
    var __VLS_55;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '@/firebase';
import { ref as dbRef, onValue, update, off, } from 'firebase/database';
import { useBoard } from '@/composables/useBoard';
import draggable from 'vuedraggable';
const route = useRoute();
const router = useRouter();
const roomCode = route.params.code;
// Room state
const roomData = ref(null);
const players = ref({});
const loading = ref(true);
const starting = ref(false);
// Current user
const currentUserId = computed(() => auth.currentUser?.uid || '');
const isHost = computed(() => roomData.value?.hostId === currentUserId.value);
// Player list as array
const playerList = computed(() => {
    return Object.entries(players.value).map(([uid, data]) => ({
        uid,
        ...data,
    }));
});
// Board setup (initialized after room data loads)
let boardComposable = null;
const flatBoard = ref([]);
const gridSize = computed(() => roomData.value?.gridSize || 5);
// Clipboard copy
const copied = ref(false);
function copyCode() {
    navigator.clipboard.writeText(roomCode);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
}
// Firebase listeners
let roomListener = null;
onMounted(() => {
    // Listen to room data (excluding players)
    const roomRef = dbRef(db, `rooms/${roomCode}`);
    roomListener = onValue(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
            router.push('/lobby');
            return;
        }
        const data = snapshot.val();
        // Separate players from room data
        const { players: playersData, ...room } = data;
        roomData.value = room;
        players.value = playersData || {};
        // Initialize board composable once we have player data
        const currentPlayer = playersData?.[currentUserId.value];
        if (currentPlayer?.board && !boardComposable) {
            boardComposable = useBoard(roomCode, currentPlayer.board);
            flatBoard.value = boardComposable.flatBoard.value;
            // Keep flatBoard in sync
            watch(boardComposable.flatBoard, (newVal) => {
                flatBoard.value = newVal;
            });
        }
        // If game started, navigate to game page
        if (room.status === 'playing') {
            router.push(`/game/${roomCode}`);
        }
        loading.value = false;
    });
});
onUnmounted(() => {
    if (roomListener) {
        off(dbRef(db, `rooms/${roomCode}`));
    }
});
// Drag & drop end handler
function onDragEnd() {
    if (boardComposable) {
        boardComposable.flatBoard.value = [...flatBoard.value];
        boardComposable.onDragEnd();
    }
}
// Randomize board
function handleRandomize() {
    if (boardComposable) {
        boardComposable.randomize();
        flatBoard.value = boardComposable.flatBoard.value;
    }
}
// Host starts the game
async function startGame() {
    if (!isHost.value)
        return;
    if (playerList.value.length < 2)
        return;
    starting.value = true;
    try {
        // Build turn order: host first, then others shuffled
        const otherPlayerIds = playerList.value
            .filter((p) => p.uid !== currentUserId.value)
            .map((p) => p.uid);
        // Shuffle others
        for (let i = otherPlayerIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherPlayerIds[i], otherPlayerIds[j]] = [otherPlayerIds[j], otherPlayerIds[i]];
        }
        const turnOrder = [currentUserId.value, ...otherPlayerIds];
        await update(dbRef(db, `rooms/${roomCode}`), {
            status: 'playing',
            turnOrder,
            currentTurnIndex: 0,
            calledNumbers: [],
            turnExpiresAt: Date.now() + 20000,
        });
    }
    catch (err) {
        console.error('Failed to start game:', err);
    }
    finally {
        starting.value = false;
    }
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
    ...{ class: "py-6" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "py-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
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
        ...{ class: "mb-6 pa-4" },
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "mb-6 pa-4" },
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "d-flex align-center flex-wrap ga-4" },
    });
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['ga-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-h5 font-weight-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
    let __VLS_18;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        color: "primary",
        ...{ class: "mr-1" },
    }));
    const __VLS_20 = __VLS_19({
        color: "primary",
        ...{ class: "mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    // @ts-ignore
    [loading,];
    var __VLS_21;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-body-2 text-medium-emphasis mt-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    (__VLS_ctx.gridSize);
    (__VLS_ctx.gridSize);
    (__VLS_ctx.gridSize);
    let __VLS_24;
    /** @ts-ignore @type {typeof __VLS_components.vSpacer | typeof __VLS_components.VSpacer} */
    vSpacer;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_29;
    /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
    vChip;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        size: "x-large",
        variant: "tonal",
        color: "primary",
        ...{ style: {} },
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        size: "x-large",
        variant: "tonal",
        color: "primary",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = ({ click: {} },
        { onClick: (__VLS_ctx.copyCode) });
    const { default: __VLS_36 } = __VLS_32.slots;
    let __VLS_37;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        start: true,
    }));
    const __VLS_39 = __VLS_38({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const { default: __VLS_42 } = __VLS_40.slots;
    (__VLS_ctx.copied ? 'mdi-check' : 'mdi-content-copy');
    // @ts-ignore
    [gridSize, gridSize, gridSize, copyCode, copied,];
    var __VLS_40;
    (__VLS_ctx.roomCode);
    // @ts-ignore
    [roomCode,];
    var __VLS_32;
    var __VLS_33;
    // @ts-ignore
    [];
    var __VLS_15;
    let __VLS_43;
    /** @ts-ignore @type {typeof __VLS_components.vRow | typeof __VLS_components.VRow | typeof __VLS_components.vRow | typeof __VLS_components.VRow} */
    vRow;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type {typeof __VLS_components.vCol | typeof __VLS_components.VCol | typeof __VLS_components.vCol | typeof __VLS_components.VCol} */
    vCol;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        cols: "12",
        md: "5",
    }));
    const __VLS_51 = __VLS_50({
        cols: "12",
        md: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_54 } = __VLS_52.slots;
    let __VLS_55;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_57 = __VLS_56({
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    const { default: __VLS_60 } = __VLS_58.slots;
    let __VLS_61;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        ...{ class: "pa-4" },
    }));
    const __VLS_63 = __VLS_62({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_66 } = __VLS_64.slots;
    let __VLS_67;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ class: "mr-2" },
    }));
    const __VLS_69 = __VLS_68({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_72 } = __VLS_70.slots;
    // @ts-ignore
    [];
    var __VLS_70;
    (__VLS_ctx.playerList.length);
    // @ts-ignore
    [playerList,];
    var __VLS_64;
    let __VLS_73;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({}));
    const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_78;
    /** @ts-ignore @type {typeof __VLS_components.vList | typeof __VLS_components.VList | typeof __VLS_components.vList | typeof __VLS_components.VList} */
    vList;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({}));
    const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_83 } = __VLS_81.slots;
    for (const [player] of __VLS_vFor((__VLS_ctx.playerList))) {
        let __VLS_84;
        /** @ts-ignore @type {typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem} */
        vListItem;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            key: (player.uid),
            title: (player.displayName),
            subtitle: (player.uid === __VLS_ctx.roomData.hostId ? 'Host' : 'Player'),
        }));
        const __VLS_86 = __VLS_85({
            key: (player.uid),
            title: (player.displayName),
            subtitle: (player.uid === __VLS_ctx.roomData.hostId ? 'Host' : 'Player'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        const { default: __VLS_89 } = __VLS_87.slots;
        {
            const { prepend: __VLS_90 } = __VLS_87.slots;
            let __VLS_91;
            /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
            vAvatar;
            // @ts-ignore
            const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
                size: "36",
                ...{ class: "mr-3" },
            }));
            const __VLS_93 = __VLS_92({
                size: "36",
                ...{ class: "mr-3" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_92));
            /** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
            const { default: __VLS_96 } = __VLS_94.slots;
            let __VLS_97;
            /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
            vImg;
            // @ts-ignore
            const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
                src: (player.photoURL || ''),
            }));
            const __VLS_99 = __VLS_98({
                src: (player.photoURL || ''),
            }, ...__VLS_functionalComponentArgsRest(__VLS_98));
            // @ts-ignore
            [playerList, roomData,];
            var __VLS_94;
            // @ts-ignore
            [];
        }
        {
            const { append: __VLS_102 } = __VLS_87.slots;
            if (player.uid === __VLS_ctx.roomData.hostId) {
                let __VLS_103;
                /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
                vChip;
                // @ts-ignore
                const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
                    size: "small",
                    color: "warning",
                    variant: "tonal",
                }));
                const __VLS_105 = __VLS_104({
                    size: "small",
                    color: "warning",
                    variant: "tonal",
                }, ...__VLS_functionalComponentArgsRest(__VLS_104));
                const { default: __VLS_108 } = __VLS_106.slots;
                let __VLS_109;
                /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
                vIcon;
                // @ts-ignore
                const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
                    start: true,
                    size: "14",
                }));
                const __VLS_111 = __VLS_110({
                    start: true,
                    size: "14",
                }, ...__VLS_functionalComponentArgsRest(__VLS_110));
                const { default: __VLS_114 } = __VLS_112.slots;
                // @ts-ignore
                [roomData,];
                var __VLS_112;
                // @ts-ignore
                [];
                var __VLS_106;
            }
            if (player.uid === __VLS_ctx.currentUserId) {
                let __VLS_115;
                /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
                vChip;
                // @ts-ignore
                const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
                    size: "small",
                    color: "info",
                    variant: "tonal",
                    ...{ class: "ml-1" },
                }));
                const __VLS_117 = __VLS_116({
                    size: "small",
                    color: "info",
                    variant: "tonal",
                    ...{ class: "ml-1" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_116));
                /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
                const { default: __VLS_120 } = __VLS_118.slots;
                // @ts-ignore
                [currentUserId,];
                var __VLS_118;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_87;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_81;
    if (__VLS_ctx.isHost) {
        let __VLS_121;
        /** @ts-ignore @type {typeof __VLS_components.vCardActions | typeof __VLS_components.VCardActions | typeof __VLS_components.vCardActions | typeof __VLS_components.VCardActions} */
        vCardActions;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
            ...{ class: "pa-4" },
        }));
        const __VLS_123 = __VLS_122({
            ...{ class: "pa-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
        const { default: __VLS_126 } = __VLS_124.slots;
        let __VLS_127;
        /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
        vBtn;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
            ...{ 'onClick': {} },
            color: "success",
            size: "large",
            block: true,
            loading: (__VLS_ctx.starting),
            disabled: (__VLS_ctx.playerList.length < 2),
        }));
        const __VLS_129 = __VLS_128({
            ...{ 'onClick': {} },
            color: "success",
            size: "large",
            block: true,
            loading: (__VLS_ctx.starting),
            disabled: (__VLS_ctx.playerList.length < 2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        let __VLS_132;
        const __VLS_133 = ({ click: {} },
            { onClick: (__VLS_ctx.startGame) });
        const { default: __VLS_134 } = __VLS_130.slots;
        let __VLS_135;
        /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
        vIcon;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
            start: true,
        }));
        const __VLS_137 = __VLS_136({
            start: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        const { default: __VLS_140 } = __VLS_138.slots;
        // @ts-ignore
        [playerList, isHost, starting, startGame,];
        var __VLS_138;
        // @ts-ignore
        [];
        var __VLS_130;
        var __VLS_131;
        if (__VLS_ctx.playerList.length < 2) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-caption text-medium-emphasis mt-2 text-center w-100" },
            });
            /** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-100']} */ ;
        }
        // @ts-ignore
        [playerList,];
        var __VLS_124;
    }
    else {
        let __VLS_141;
        /** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
        vCardText;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
            ...{ class: "text-center text-medium-emphasis" },
        }));
        const __VLS_143 = __VLS_142({
            ...{ class: "text-center text-medium-emphasis" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
        const { default: __VLS_146 } = __VLS_144.slots;
        let __VLS_147;
        /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
        vIcon;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
            ...{ class: "mr-1" },
        }));
        const __VLS_149 = __VLS_148({
            ...{ class: "mr-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
        /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
        const { default: __VLS_152 } = __VLS_150.slots;
        // @ts-ignore
        [];
        var __VLS_150;
        // @ts-ignore
        [];
        var __VLS_144;
    }
    // @ts-ignore
    [];
    var __VLS_58;
    // @ts-ignore
    [];
    var __VLS_52;
    let __VLS_153;
    /** @ts-ignore @type {typeof __VLS_components.vCol | typeof __VLS_components.VCol | typeof __VLS_components.vCol | typeof __VLS_components.VCol} */
    vCol;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
        cols: "12",
        md: "7",
    }));
    const __VLS_155 = __VLS_154({
        cols: "12",
        md: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    const { default: __VLS_158 } = __VLS_156.slots;
    let __VLS_159;
    /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
    vCard;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
        elevation: "4",
        rounded: "xl",
    }));
    const __VLS_161 = __VLS_160({
        elevation: "4",
        rounded: "xl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    const { default: __VLS_164 } = __VLS_162.slots;
    let __VLS_165;
    /** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
    vCardTitle;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        ...{ class: "d-flex align-center pa-4" },
    }));
    const __VLS_167 = __VLS_166({
        ...{ class: "d-flex align-center pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_170 } = __VLS_168.slots;
    let __VLS_171;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        ...{ class: "mr-2" },
    }));
    const __VLS_173 = __VLS_172({
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    const { default: __VLS_176 } = __VLS_174.slots;
    // @ts-ignore
    [];
    var __VLS_174;
    let __VLS_177;
    /** @ts-ignore @type {typeof __VLS_components.vSpacer | typeof __VLS_components.VSpacer} */
    vSpacer;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({}));
    const __VLS_179 = __VLS_178({}, ...__VLS_functionalComponentArgsRest(__VLS_178));
    let __VLS_182;
    /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
    vBtn;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
        ...{ 'onClick': {} },
        variant: "tonal",
        color: "primary",
        size: "small",
    }));
    const __VLS_184 = __VLS_183({
        ...{ 'onClick': {} },
        variant: "tonal",
        color: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    let __VLS_187;
    const __VLS_188 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRandomize) });
    const { default: __VLS_189 } = __VLS_185.slots;
    let __VLS_190;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
        start: true,
    }));
    const __VLS_192 = __VLS_191({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    const { default: __VLS_195 } = __VLS_193.slots;
    // @ts-ignore
    [handleRandomize,];
    var __VLS_193;
    // @ts-ignore
    [];
    var __VLS_185;
    var __VLS_186;
    // @ts-ignore
    [];
    var __VLS_168;
    let __VLS_196;
    /** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
    vDivider;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({}));
    const __VLS_198 = __VLS_197({}, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_201;
    /** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
    vCardText;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
        ...{ class: "pa-4" },
    }));
    const __VLS_203 = __VLS_202({
        ...{ class: "pa-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    /** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
    const { default: __VLS_206 } = __VLS_204.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-2 text-medium-emphasis mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-medium-emphasis']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    let __VLS_207;
    /** @ts-ignore @type {typeof __VLS_components.draggable | typeof __VLS_components.Draggable | typeof __VLS_components.draggable | typeof __VLS_components.Draggable} */
    draggable;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
        ...{ 'onEnd': {} },
        modelValue: (__VLS_ctx.flatBoard),
        itemKey: "element",
        ...{ class: "d-grid" },
        ...{ style: ({
                display: 'grid',
                gridTemplateColumns: `repeat(${__VLS_ctx.gridSize}, 1fr)`,
                gap: '8px',
                maxWidth: __VLS_ctx.gridSize <= 3 ? '280px' : '400px',
                margin: '0 auto',
            }) },
    }));
    const __VLS_209 = __VLS_208({
        ...{ 'onEnd': {} },
        modelValue: (__VLS_ctx.flatBoard),
        itemKey: "element",
        ...{ class: "d-grid" },
        ...{ style: ({
                display: 'grid',
                gridTemplateColumns: `repeat(${__VLS_ctx.gridSize}, 1fr)`,
                gap: '8px',
                maxWidth: __VLS_ctx.gridSize <= 3 ? '280px' : '400px',
                margin: '0 auto',
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    let __VLS_212;
    const __VLS_213 = ({ end: {} },
        { onEnd: (__VLS_ctx.onDragEnd) });
    /** @type {__VLS_StyleScopedClasses['d-grid']} */ ;
    const { default: __VLS_214 } = __VLS_210.slots;
    {
        const { item: __VLS_215 } = __VLS_210.slots;
        const [{ element }] = __VLS_vSlot(__VLS_215);
        let __VLS_216;
        /** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
        vCard;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
            key: (element),
            ...{ class: "d-flex align-center justify-center" },
            ...{ style: ({
                    aspectRatio: '1',
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: __VLS_ctx.gridSize <= 3 ? '1.4rem' : '1.1rem',
                    fontWeight: 'bold',
                }) },
            color: "surface-variant",
            variant: "tonal",
            rounded: "lg",
            elevation: "2",
        }));
        const __VLS_218 = __VLS_217({
            key: (element),
            ...{ class: "d-flex align-center justify-center" },
            ...{ style: ({
                    aspectRatio: '1',
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: __VLS_ctx.gridSize <= 3 ? '1.4rem' : '1.1rem',
                    fontWeight: 'bold',
                }) },
            color: "surface-variant",
            variant: "tonal",
            rounded: "lg",
            elevation: "2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        /** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_221 } = __VLS_219.slots;
        (element);
        // @ts-ignore
        [gridSize, gridSize, gridSize, flatBoard, onDragEnd,];
        var __VLS_219;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_210;
    var __VLS_211;
    // @ts-ignore
    [];
    var __VLS_204;
    // @ts-ignore
    [];
    var __VLS_162;
    // @ts-ignore
    [];
    var __VLS_156;
    // @ts-ignore
    [];
    var __VLS_46;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

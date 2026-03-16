import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRoom } from '@/composables/useRoom';
const { user, logout } = useAuth();
const { createRoom, joinRoom, error, loading } = useRoom();
const gridSize = ref(5);
const joinCode = ref('');
const activeTab = ref('create');
async function handleCreate() {
    await createRoom(gridSize.value);
}
async function handleJoin() {
    if (!joinCode.value.trim()) {
        error.value = 'Please enter a room code';
        return;
    }
    await joinRoom(joinCode.value);
}
async function handleLogout() {
    await logout();
    window.location.href = '/login';
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
    ...{ class: "fill-height d-flex align-center justify-center" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "fill-height d-flex align-center justify-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['fill-height']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.vCard | typeof __VLS_components.VCard | typeof __VLS_components.vCard | typeof __VLS_components.VCard} */
vCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    width: "480",
    elevation: "8",
    rounded: "xl",
}));
const __VLS_9 = __VLS_8({
    width: "480",
    elevation: "8",
    rounded: "xl",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
vCardTitle;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ class: "d-flex align-center pa-4" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "d-flex align-center pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
vIcon;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    color: "primary",
    ...{ class: "mr-2" },
}));
const __VLS_21 = __VLS_20({
    color: "primary",
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
const { default: __VLS_24 } = __VLS_22.slots;
var __VLS_22;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-h5 font-weight-bold" },
});
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.vSpacer | typeof __VLS_components.VSpacer} */
vSpacer;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
if (__VLS_ctx.user) {
    let __VLS_30;
    /** @ts-ignore @type {typeof __VLS_components.vChip | typeof __VLS_components.VChip | typeof __VLS_components.vChip | typeof __VLS_components.VChip} */
    vChip;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        variant: "tonal",
        size: "small",
    }));
    const __VLS_32 = __VLS_31({
        variant: "tonal",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    let __VLS_36;
    /** @ts-ignore @type {typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar | typeof __VLS_components.vAvatar | typeof __VLS_components.VAvatar} */
    vAvatar;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        start: true,
        size: "24",
    }));
    const __VLS_38 = __VLS_37({
        start: true,
        size: "24",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_41 } = __VLS_39.slots;
    let __VLS_42;
    /** @ts-ignore @type {typeof __VLS_components.vImg | typeof __VLS_components.VImg} */
    vImg;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        src: (__VLS_ctx.user.photoURL || ''),
    }));
    const __VLS_44 = __VLS_43({
        src: (__VLS_ctx.user.photoURL || ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    // @ts-ignore
    [user, user,];
    var __VLS_39;
    (__VLS_ctx.user.displayName);
    // @ts-ignore
    [user,];
    var __VLS_33;
}
let __VLS_47;
/** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
vBtn;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
    icon: "mdi-logout",
    variant: "text",
    size: "small",
    ...{ class: "ml-2" },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    icon: "mdi-logout",
    variant: "text",
    size: "small",
    ...{ class: "ml-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogout) });
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
var __VLS_50;
var __VLS_51;
// @ts-ignore
[handleLogout,];
var __VLS_16;
let __VLS_54;
/** @ts-ignore @type {typeof __VLS_components.vDivider | typeof __VLS_components.VDivider} */
vDivider;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_59;
/** @ts-ignore @type {typeof __VLS_components.vTabs | typeof __VLS_components.VTabs | typeof __VLS_components.vTabs | typeof __VLS_components.VTabs} */
vTabs;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.activeTab),
    grow: true,
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.activeTab),
    grow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type {typeof __VLS_components.vTab | typeof __VLS_components.VTab | typeof __VLS_components.vTab | typeof __VLS_components.VTab} */
vTab;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    value: "create",
}));
const __VLS_67 = __VLS_66({
    value: "create",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
// @ts-ignore
[activeTab,];
var __VLS_68;
let __VLS_71;
/** @ts-ignore @type {typeof __VLS_components.vTab | typeof __VLS_components.VTab | typeof __VLS_components.vTab | typeof __VLS_components.VTab} */
vTab;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    value: "join",
}));
const __VLS_73 = __VLS_72({
    value: "join",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_62;
let __VLS_77;
/** @ts-ignore @type {typeof __VLS_components.vCardText | typeof __VLS_components.VCardText | typeof __VLS_components.vCardText | typeof __VLS_components.VCardText} */
vCardText;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ class: "pa-6" },
}));
const __VLS_79 = __VLS_78({
    ...{ class: "pa-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
/** @type {__VLS_StyleScopedClasses['pa-6']} */ ;
const { default: __VLS_82 } = __VLS_80.slots;
if (__VLS_ctx.error) {
    let __VLS_83;
    /** @ts-ignore @type {typeof __VLS_components.vAlert | typeof __VLS_components.VAlert | typeof __VLS_components.vAlert | typeof __VLS_components.VAlert} */
    vAlert;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onClick:close': {} },
        type: "error",
        variant: "tonal",
        closable: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick:close': {} },
        type: "error",
        variant: "tonal",
        closable: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = ({ 'click:close': {} },
        { 'onClick:close': (...[$event]) => {
                if (!(__VLS_ctx.error))
                    return;
                __VLS_ctx.error = '';
                // @ts-ignore
                [error, error,];
            } });
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_90 } = __VLS_86.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    var __VLS_86;
    var __VLS_87;
}
if (__VLS_ctx.activeTab === 'create') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    let __VLS_91;
    /** @ts-ignore @type {typeof __VLS_components.vSelect | typeof __VLS_components.VSelect} */
    vSelect;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        modelValue: (__VLS_ctx.gridSize),
        items: ([
            { title: '2×2 (Quick — 2 lines to win)', value: 2 },
            { title: '3×3 (Short — 3 lines to win)', value: 3 },
            { title: '4×4 (Medium — 4 lines to win)', value: 4 },
            { title: '5×5 (Classic — 5 lines to win)', value: 5 },
        ]),
        itemTitle: "title",
        itemValue: "value",
        label: "Grid Size",
        variant: "outlined",
        ...{ class: "mb-4" },
    }));
    const __VLS_93 = __VLS_92({
        modelValue: (__VLS_ctx.gridSize),
        items: ([
            { title: '2×2 (Quick — 2 lines to win)', value: 2 },
            { title: '3×3 (Short — 3 lines to win)', value: 3 },
            { title: '4×4 (Medium — 4 lines to win)', value: 4 },
            { title: '5×5 (Classic — 5 lines to win)', value: 5 },
        ]),
        itemTitle: "title",
        itemValue: "value",
        label: "Grid Size",
        variant: "outlined",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    let __VLS_96;
    /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
    vBtn;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        color: "primary",
        size: "large",
        block: true,
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        color: "primary",
        size: "large",
        block: true,
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = ({ click: {} },
        { onClick: (__VLS_ctx.handleCreate) });
    const { default: __VLS_103 } = __VLS_99.slots;
    let __VLS_104;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        start: true,
    }));
    const __VLS_106 = __VLS_105({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    // @ts-ignore
    [activeTab, gridSize, loading, handleCreate,];
    var __VLS_107;
    // @ts-ignore
    [];
    var __VLS_99;
    var __VLS_100;
}
if (__VLS_ctx.activeTab === 'join') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-body-1 mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    let __VLS_110;
    /** @ts-ignore @type {typeof __VLS_components.vTextField | typeof __VLS_components.VTextField} */
    vTextField;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.joinCode),
        label: "Room Code",
        placeholder: "e.g. XK92BF",
        variant: "outlined",
        maxlength: "6",
        ...{ class: "mb-4" },
        rules: ([
            (v) => v.length === 6 || 'Code must be 6 characters',
        ]),
        ...{ style: {} },
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.joinCode),
        label: "Room Code",
        placeholder: "e.g. XK92BF",
        variant: "outlined",
        maxlength: "6",
        ...{ class: "mb-4" },
        rules: ([
            (v) => v.length === 6 || 'Code must be 6 characters',
        ]),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    const __VLS_116 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleJoin) });
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    var __VLS_113;
    var __VLS_114;
    let __VLS_117;
    /** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
    vBtn;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
        ...{ 'onClick': {} },
        color: "secondary",
        size: "large",
        block: true,
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.joinCode.trim().length !== 6),
    }));
    const __VLS_119 = __VLS_118({
        ...{ 'onClick': {} },
        color: "secondary",
        size: "large",
        block: true,
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.joinCode.trim().length !== 6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    let __VLS_122;
    const __VLS_123 = ({ click: {} },
        { onClick: (__VLS_ctx.handleJoin) });
    const { default: __VLS_124 } = __VLS_120.slots;
    let __VLS_125;
    /** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
    vIcon;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        start: true,
    }));
    const __VLS_127 = __VLS_126({
        start: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    const { default: __VLS_130 } = __VLS_128.slots;
    // @ts-ignore
    [activeTab, loading, joinCode, joinCode, handleJoin, handleJoin,];
    var __VLS_128;
    // @ts-ignore
    [];
    var __VLS_120;
    var __VLS_121;
}
// @ts-ignore
[];
var __VLS_80;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

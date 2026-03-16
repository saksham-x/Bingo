import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
const { user, loading, signInWithGoogle } = useAuth();
const router = useRouter();
watch(user, (newUser) => {
    if (newUser) {
        router.push('/lobby');
    }
});
async function handleLogin() {
    try {
        await signInWithGoogle();
    }
    catch (error) {
        console.error('Login failed:', error);
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
    width: "400",
    ...{ class: "pa-8 text-center" },
    elevation: "8",
    rounded: "xl",
}));
const __VLS_9 = __VLS_8({
    width: "400",
    ...{ class: "pa-8 text-center" },
    elevation: "8",
    rounded: "xl",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['pa-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
vIcon;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    size: "64",
    color: "primary",
    ...{ class: "mb-4" },
}));
const __VLS_15 = __VLS_14({
    size: "64",
    color: "primary",
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
var __VLS_16;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle | typeof __VLS_components.vCardTitle | typeof __VLS_components.VCardTitle} */
vCardTitle;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ class: "text-h4 font-weight-bold mb-2" },
}));
const __VLS_21 = __VLS_20({
    ...{ class: "text-h4 font-weight-bold mb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
/** @type {__VLS_StyleScopedClasses['text-h4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
const { default: __VLS_24 } = __VLS_22.slots;
var __VLS_22;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.vCardSubtitle | typeof __VLS_components.VCardSubtitle | typeof __VLS_components.vCardSubtitle | typeof __VLS_components.VCardSubtitle} */
vCardSubtitle;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ class: "text-body-1 mb-6" },
}));
const __VLS_27 = __VLS_26({
    ...{ class: "text-body-1 mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
/** @type {__VLS_StyleScopedClasses['text-body-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
const { default: __VLS_30 } = __VLS_28.slots;
var __VLS_28;
let __VLS_31;
/** @ts-ignore @type {typeof __VLS_components.vBtn | typeof __VLS_components.VBtn | typeof __VLS_components.vBtn | typeof __VLS_components.VBtn} */
vBtn;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    ...{ 'onClick': {} },
    color: "white",
    size: "large",
    block: true,
    variant: "outlined",
    loading: (__VLS_ctx.loading),
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
    color: "white",
    size: "large",
    block: true,
    variant: "outlined",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_36;
const __VLS_37 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogin) });
const { default: __VLS_38 } = __VLS_34.slots;
let __VLS_39;
/** @ts-ignore @type {typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon} */
vIcon;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    start: true,
}));
const __VLS_41 = __VLS_40({
    start: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
// @ts-ignore
[loading, handleLogin,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_34;
var __VLS_35;
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

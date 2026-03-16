import { onMounted, ref } from 'vue';
import { auth } from '@/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  })

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function logout() {
    await signOut(auth)
  }

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
  }
}
<template>
  <div class="py-6">
    <div class="container mx-auto px-4">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Administration</h1>
          <p class="text-gray-600">Gestion des utilisateurs et organisations</p>
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="showCreateUserModal = true"
        >
          Nouvel utilisateur
        </UButton>
      </div>

      <!-- Tableau des utilisateurs -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Utilisateurs</h3>
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher..."
              class="max-w-xs"
            />
          </div>
        </template>

        <UTable
          :rows="filteredUsers"
          :columns="[
            { key: 'name', label: 'Nom' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Rôle' },
            { key: 'organization', label: 'Organisation' },
            { key: 'actions', label: 'Actions' }
          ]"
        >
          <template #role-data="{ row }">
            <UBadge :color="row.role === 'ADMIN' ? 'red' : 'blue'">
              {{ row.role }}
            </UBadge>
          </template>

          <template #actions-data="{ row }">
            <div class="flex gap-2">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-pencil"
                @click="editUser(row)"
              />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                @click="deleteUser(row)"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- Modal de création/édition -->
    <UModal v-model="showCreateUserModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingUser ? 'Modifier' : 'Nouvel' }} utilisateur
          </h3>
        </template>

        <form @submit.prevent="saveUser" class="space-y-4">
          <UFormGroup label="Nom">
            <UInput v-model="userForm.name" required />
          </UFormGroup>

          <UFormGroup label="Email">
            <UInput v-model="userForm.email" type="email" required />
          </UFormGroup>

          <UFormGroup label="Rôle">
            <USelect
              v-model="userForm.role"
              :options="[
                { label: 'Administrateur', value: 'ADMIN' },
                { label: 'Utilisateur', value: 'USER' }
              ]"
            />
          </UFormGroup>

          <UFormGroup label="Organisation">
            <USelect
              v-model="userForm.organization_id"
              :options="organizations"
              option-attribute="name"
              value-attribute="id"
            />
          </UFormGroup>

          <UFormGroup v-if="!editingUser" label="Mot de passe">
            <UInput v-model="userForm.password" type="password" required />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="showCreateUserModal = false"
            >
              Annuler
            </UButton>
            <UButton
              color="primary"
              :loading="saving"
              @click="saveUser"
            >
              {{ editingUser ? 'Mettre à jour' : 'Créer' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const showCreateUserModal = ref(false)
const saving = ref(false)
const editingUser = ref<any>(null)

const userForm = ref({
  name: '',
  email: '',
  role: 'USER',
  organization_id: '',
  password: ''
})

// Charger les utilisateurs
const { data: users, refresh: refreshUsers } = await useFetch('/api/admin/users')

// Charger les organisations
const { data: organizations } = await useFetch('/api/admin/organizations')

// Filtrer les utilisateurs
const filteredUsers = computed(() => {
  if (!users.value || !search.value) return users.value

  const searchLower = search.value.toLowerCase()
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower)
  )
})

// Éditer un utilisateur
function editUser(user: any) {
  editingUser.value = user
  userForm.value = { ...user, password: '' }
  showCreateUserModal.value = true
}

// Supprimer un utilisateur
async function deleteUser(user: any) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) return

  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE'
    })
    
    refreshUsers()
    
    useToast().add({
      title: 'Succès',
      description: 'Utilisateur supprimé',
      color: 'green'
    })
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de supprimer l\'utilisateur',
      color: 'red'
    })
  }
}

// Sauvegarder un utilisateur
async function saveUser() {
  try {
    saving.value = true
    
    const method = editingUser.value ? 'PUT' : 'POST'
    const url = editingUser.value 
      ? `/api/admin/users/${editingUser.value.id}`
      : '/api/admin/users'

    await $fetch(url, {
      method,
      body: userForm.value
    })

    showCreateUserModal.value = false
    refreshUsers()
    
    useToast().add({
      title: 'Succès',
      description: `Utilisateur ${editingUser.value ? 'modifié' : 'créé'}`,
      color: 'green'
    })
  } catch (error) {
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de sauvegarder l\'utilisateur',
      color: 'red'
    })
  } finally {
    saving.value = false
    editingUser.value = null
  }
}
</script> 
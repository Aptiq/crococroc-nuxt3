const analyze = async (data) => {
    try {
      const response = await useFetch('/api/analyze', {
        method: 'POST',
        body: data
      })
      return response.data.value
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }
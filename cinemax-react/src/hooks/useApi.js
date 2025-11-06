import { useState, useCallback } from 'react'

const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 5000,
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

      const url = `${API_CONFIG.BASE_URL}${endpoint}`
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      }

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.name === 'AbortError' 
        ? 'Tempo esgotado - servidor não respondeu'
        : err.message
      
      setError(errorMessage)
      return { success: false, error: errorMessage, data: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const getFilmesEmCartaz = useCallback(() => request('/filmes/em-cartaz'), [request])
  const getAllFilmes = useCallback(() => request('/filmes'), [request])
  const getFilmeById = useCallback((id) => request(`/filmes/${id}`), [request])
  const getSessoesPorFilme = useCallback((filmeId, data) => 
    request(`/sessoes/filme/${filmeId}?data=${data}`), [request])

  return {
    loading,
    error,
    getFilmesEmCartaz,
    getAllFilmes,
    getFilmeById,
    getSessoesPorFilme,
  }
}
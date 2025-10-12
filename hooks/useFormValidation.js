"use client"
import { useState, useCallback } from 'react'

export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const setValue = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }, [errors])

  const setFieldTouched = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }, [])

  const validateField = useCallback((field, value) => {
    const rule = validationRules[field]
    if (!rule) return ''

    if (rule.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return rule.message || `${field} is required`
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      return `${field} must be at least ${rule.minLength} characters`
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      return `${field} must be no more than ${rule.maxLength} characters`
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message || `${field} format is invalid`
    }

    if (rule.custom && typeof rule.custom === 'function') {
      return rule.custom(value) || ''
    }

    return ''
  }, [validationRules])

  const validateForm = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField, validationRules])

  const resetForm = useCallback(() => {
    setValues(initialState)
    setErrors({})
    setTouched({})
  }, [initialState])

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    resetForm,
    validateField
  }
}

// Interview form validation rules
export const interviewValidationRules = {
  jobPosition: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Job position must be between 2 and 100 characters'
  },
  jobDescription: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    message: 'Job description must be between 10 and 2000 characters'
  },
  interviewDuration: {
    required: true,
    message: 'Please select interview duration'
  },
  interviewTypes: {
    required: true,
    custom: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return 'Please select at least one interview type'
      }
      if (value.length > 5) {
        return 'Please select no more than 5 interview types'
      }
      return ''
    }
  }
}
interface ValidationResult {
    isValid: boolean
    errorMessage: string
}

export function useFormValidation() {
    const validateForm = (
        fields: Record<string, string>,
        options?: {
            minPasswordLength?: number
            confirmPasswordField?: string
        }
    ): ValidationResult => {
        const minPasswordLength = options?.minPasswordLength ?? 6
        const confirmPasswordField = options?.confirmPasswordField

        for (const [key, value] of Object.entries(fields)) {
            if (!value || value.trim() === '') {
                return {
                    isValid: false,
                    errorMessage: `Please fill in ${key}`,
                }
            }
        }

        if (confirmPasswordField && 'password' in fields) {
            const password = fields.password
            const confirmPassword = fields[confirmPasswordField]

            if (!password || !confirmPassword) {
                return {
                    isValid: false,
                    errorMessage: 'Password fields are required',
                }
            }

            if (password !== confirmPassword) {
                return {
                    isValid: false,
                    errorMessage: 'Passwords do not match',
                }
            }

            if (password.length < minPasswordLength) {
                return {
                    isValid: false,
                    errorMessage: `Password must be at least ${minPasswordLength} characters`,
                }
            }
        }

        if (fields.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(fields.email)) {
                return {
                    isValid: false,
                    errorMessage: 'Please enter a valid email address',
                }
            }
        }

        return { isValid: true, errorMessage: '' }
    }

    return { validateForm }
}

#!/bin/sh

# Environment variable injection script for Groq API Playground
# This script runs at container startup to inject environment variables

set -e

# Default values
DEFAULT_API_KEY=""
DEFAULT_NODE_ENV="production"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to create runtime config
create_runtime_config() {
    local config_file="/usr/share/nginx/html/config.js"

    log "Creating runtime configuration..."

    cat > "$config_file" << EOF
// Runtime configuration for Groq API Playground
window.ENV = {
    GROQ_API_KEY: '${VITE_GROQ_API_KEY:-$DEFAULT_API_KEY}',
    NODE_ENV: '${NODE_ENV:-$DEFAULT_NODE_ENV}',
    VERSION: '1.0.0',
    BUILD_TIME: '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'
};
EOF

    log "Runtime configuration created successfully"
}

# Function to update HTML files with environment variables
update_html_files() {
    local html_dir="/usr/share/nginx/html"

    log "Updating HTML files with environment variables..."

    # Find and replace environment variable placeholders in HTML files
    find "$html_dir" -name "*.html" -type f -exec sed -i \
        -e "s|__VITE_GROQ_API_KEY__|${VITE_GROQ_API_KEY:-$DEFAULT_API_KEY}|g" \
        -e "s|__NODE_ENV__|${NODE_ENV:-$DEFAULT_NODE_ENV}|g" \
        {} \;

    log "HTML files updated successfully"
}

# Function to validate environment variables
validate_env() {
    log "Validating environment variables..."

    # Check if critical environment variables are set
    if [ -z "$VITE_GROQ_API_KEY" ]; then
        log "WARNING: VITE_GROQ_API_KEY is not set. The application may not function properly."
        log "Please set the GROQ_API_KEY environment variable or configure it through the UI."
    else
        log "VITE_GROQ_API_KEY is configured"
    fi

    # Validate API key format (basic check)
    if [ -n "$VITE_GROQ_API_KEY" ]; then
        case "$VITE_GROQ_API_KEY" in
            gsk_*)
                log "API key format appears valid"
                ;;
            *)
                log "WARNING: API key format may be invalid. Groq API keys typically start with 'gsk_'"
                ;;
        esac
    fi

    log "Environment validation completed"
}

# Function to set up nginx configuration
setup_nginx() {
    log "Setting up nginx configuration..."

    # Ensure nginx has proper permissions
    chown -R nginx:nginx /usr/share/nginx/html

    # Test nginx configuration
    if nginx -t > /dev/null 2>&1; then
        log "Nginx configuration is valid"
    else
        log "ERROR: Nginx configuration is invalid"
        exit 1
    fi
}

# Function to create health check endpoint
create_health_check() {
    local health_file="/usr/share/nginx/html/health"

    log "Creating health check endpoint..."

    cat > "$health_file" << EOF
{
    "status": "healthy",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "1.0.0",
    "environment": "${NODE_ENV:-$DEFAULT_NODE_ENV}",
    "uptime": "$(uptime -p)"
}
EOF

    log "Health check endpoint created"
}

# Main execution
main() {
    log "Starting Groq API Playground environment setup..."

    # Display current environment
    log "Current environment:"
    log "  NODE_ENV: ${NODE_ENV:-$DEFAULT_NODE_ENV}"
    log "  VITE_GROQ_API_KEY: ${VITE_GROQ_API_KEY:+***configured***}"

    # Run setup functions
    validate_env
    create_runtime_config
    update_html_files
    setup_nginx
    create_health_check

    log "Environment setup completed successfully"

    # Print startup message
    echo "=========================================="
    echo "  Groq API Playground is ready!"
    echo "  Environment: ${NODE_ENV:-$DEFAULT_NODE_ENV}"
    echo "  Port: 80"
    echo "  Health Check: /health"
    echo "=========================================="
}

# Error handling
trap 'log "ERROR: Script failed at line $LINENO"' ERR

# Run main function
main "$@"

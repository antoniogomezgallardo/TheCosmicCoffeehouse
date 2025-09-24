#!/bin/bash

# Consumer Contract Tests Runner Script
# Executes frontend contract tests to generate pact files

set -e  # Exit on any error

# Colors for output formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="$PROJECT_ROOT/reports/consumer-tests"
PACT_DIR="$PROJECT_ROOT/pacts"

echo -e "${PURPLE}🎭 API Contract Testing - Consumer Test Runner${NC}"
echo -e "${BLUE}📅 Timestamp: $TIMESTAMP${NC}"
echo -e "${BLUE}📂 Project Root: $PROJECT_ROOT${NC}"
echo "=================================================="

# Create directories
mkdir -p "$REPORT_DIR"
mkdir -p "$PACT_DIR"

cd "$PROJECT_ROOT"

# Function to print section headers
print_section() {
    echo -e "\n${CYAN}▶️  $1${NC}"
    echo "----------------------------------------"
}

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 completed successfully${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# 1. Environment Validation
print_section "Environment Validation"
echo -e "${YELLOW}🔧 Validating environment...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"

# 2. Dependencies Check
print_section "Dependencies Installation"
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

npm install --silent
check_success "Dependencies installation"

# 3. TypeScript Compilation Check
print_section "TypeScript Compilation"
echo -e "${YELLOW}🔨 Checking TypeScript compilation...${NC}"

npx tsc --noEmit
check_success "TypeScript compilation check"

# 4. Clean Previous Pact Files
print_section "Cleanup Previous Results"
echo -e "${YELLOW}🧹 Cleaning previous pact files...${NC}"

rm -f "$PACT_DIR"/*.json
echo -e "${GREEN}✅ Previous pact files cleaned${NC}"

# 5. Consumer Tests Execution
print_section "Consumer Contract Tests Execution"

echo -e "${YELLOW}🎭 Running consumer contract tests...${NC}"

# Authentication Consumer Tests
echo -e "  ${BLUE}• Authentication API Contracts...${NC}"
npm test -- --testMatch='**/consumer/auth/*.pact.test.ts' --json --outputFile="$REPORT_DIR/auth-consumer-$TIMESTAMP.json" || {
    echo -e "${RED}❌ Authentication consumer tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Authentication contracts generated${NC}"

# Products Consumer Tests
echo -e "  ${BLUE}• Products API Contracts...${NC}"
npm test -- --testMatch='**/consumer/products/*.pact.test.ts' --json --outputFile="$REPORT_DIR/products-consumer-$TIMESTAMP.json" || {
    echo -e "${RED}❌ Products consumer tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Products contracts generated${NC}"

# Cart Consumer Tests (if implemented)
if [ -f "consumer/cart/cart.consumer.pact.test.ts" ]; then
    echo -e "  ${BLUE}• Cart API Contracts...${NC}"
    npm test -- --testMatch='**/consumer/cart/*.pact.test.ts' --json --outputFile="$REPORT_DIR/cart-consumer-$TIMESTAMP.json" || {
        echo -e "${YELLOW}⚠️ Cart consumer tests failed (optional)${NC}"
    }
else
    echo -e "  ${YELLOW}• Cart API Contracts (Not implemented yet)${NC}"
fi

check_success "Consumer tests execution"

# 6. Pact Files Validation
print_section "Pact Files Validation"
echo -e "${YELLOW}📋 Validating generated pact files...${NC}"

PACT_COUNT=0
for pact_file in "$PACT_DIR"/*.json; do
    if [ -f "$pact_file" ]; then
        PACT_COUNT=$((PACT_COUNT + 1))
        echo -e "  ${GREEN}✅ $(basename "$pact_file")${NC}"

        # Validate JSON format
        if ! jq empty "$pact_file" 2>/dev/null; then
            echo -e "  ${RED}❌ Invalid JSON format in $(basename "$pact_file")${NC}"
            exit 1
        fi

        # Show contract summary
        CONSUMER_NAME=$(jq -r '.consumer.name' "$pact_file")
        PROVIDER_NAME=$(jq -r '.provider.name' "$pact_file")
        INTERACTIONS_COUNT=$(jq '.interactions | length' "$pact_file")

        echo -e "    Consumer: ${CYAN}$CONSUMER_NAME${NC}"
        echo -e "    Provider: ${CYAN}$PROVIDER_NAME${NC}"
        echo -e "    Interactions: ${CYAN}$INTERACTIONS_COUNT${NC}"
    fi
done

if [ $PACT_COUNT -eq 0 ]; then
    echo -e "${RED}❌ No pact files generated${NC}"
    exit 1
else
    echo -e "${GREEN}✅ $PACT_COUNT pact file(s) generated successfully${NC}"
fi

# 7. Contract Coverage Analysis
print_section "Contract Coverage Analysis"
echo -e "${YELLOW}📊 Analyzing contract coverage...${NC}"

# Count total interactions across all pacts
TOTAL_INTERACTIONS=0
for pact_file in "$PACT_DIR"/*.json; do
    if [ -f "$pact_file" ]; then
        INTERACTIONS=$(jq '.interactions | length' "$pact_file")
        TOTAL_INTERACTIONS=$((TOTAL_INTERACTIONS + INTERACTIONS))

        # Show interactions by endpoint
        echo -e "  ${BLUE}• $(basename "$pact_file" .json):${NC}"
        jq -r '.interactions[] | "    - \(.request.method) \(.request.path): \(.description)"' "$pact_file"
    fi
done

echo -e "${GREEN}✅ Total contract interactions: $TOTAL_INTERACTIONS${NC}"

# 8. Generate Summary Report
print_section "Contract Summary Report"

SUMMARY_FILE="$REPORT_DIR/consumer-summary-$TIMESTAMP.md"

cat > "$SUMMARY_FILE" << EOF
# Consumer Contract Test Summary

**Execution Date:** $(date)
**Total Pact Files Generated:** $PACT_COUNT
**Total Contract Interactions:** $TOTAL_INTERACTIONS

## Generated Contracts

EOF

for pact_file in "$PACT_DIR"/*.json; do
    if [ -f "$pact_file" ]; then
        CONSUMER_NAME=$(jq -r '.consumer.name' "$pact_file")
        PROVIDER_NAME=$(jq -r '.provider.name' "$pact_file")
        INTERACTIONS_COUNT=$(jq '.interactions | length' "$pact_file")

        cat >> "$SUMMARY_FILE" << EOF
### $(basename "$pact_file" .json)
- **Consumer:** $CONSUMER_NAME
- **Provider:** $PROVIDER_NAME
- **Interactions:** $INTERACTIONS_COUNT

#### Covered Endpoints:
EOF

        jq -r '.interactions[] | "- `\(.request.method) \(.request.path)`: \(.description)"' "$pact_file" >> "$SUMMARY_FILE"
        echo "" >> "$SUMMARY_FILE"
    fi
done

cat >> "$SUMMARY_FILE" << EOF

## Next Steps
1. Share pact files with the backend team
2. Run provider verification tests
3. Integrate contracts into CI/CD pipeline

## Files Location
- **Pact Files:** \`$PACT_DIR/\`
- **Test Reports:** \`$REPORT_DIR/\`

---
Generated by Consumer Contract Test Runner
EOF

echo -e "${GREEN}✅ Summary report generated: $SUMMARY_FILE${NC}"

# 9. Final Status
print_section "Final Status"

echo -e "${GREEN}🎉 Consumer contract tests completed successfully!${NC}"
echo -e "${BLUE}📁 Pact files location: $PACT_DIR${NC}"
echo -e "${BLUE}📊 Reports location: $REPORT_DIR${NC}"
echo -e "${BLUE}📝 Summary report: $SUMMARY_FILE${NC}"

echo -e "\n${PURPLE}=================================================="
echo -e "✅ CONSUMER CONTRACT GENERATION: SUCCESS"
echo -e "📋 Generated $PACT_COUNT pact file(s)"
echo -e "🔗 Total $TOTAL_INTERACTIONS contract interactions"
echo -e "📤 Ready for provider verification"
echo -e "==================================================${NC}"

# Optional: Display next steps
echo -e "\n${CYAN}📋 Next Steps:${NC}"
echo -e "1. Share pact files with backend team:"
echo -e "   ${YELLOW}cp $PACT_DIR/*.json /shared/contracts/${NC}"
echo -e "2. Run provider verification:"
echo -e "   ${YELLOW}./scripts/run-provider-verification.sh${NC}"
echo -e "3. Publish contracts to broker:"
echo -e "   ${YELLOW}npm run pact:publish${NC}"

exit 0
#!/bin/bash
# Verification script for 80-character line length standard

echo "🔍 Checking code quality compliance..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Count violations in source files (excluding package-lock.json)
echo "📊 Scanning for lines exceeding 80 characters..."
echo ""

VIOLATIONS=0

# Check TypeScript/JavaScript files
echo "Checking TypeScript/JavaScript files..."
TS_VIOLATIONS=$(find . -type f \( -name "*.ts" -o -name "*.js" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -path "*/.next/*" \
  ! -path "*/dist/*" \
  ! -name "package-lock.json" \
  -exec awk 'length > 80 {print FILENAME":"NR":"$0}' {} \; | wc -l)
echo "  TypeScript/JavaScript: $TS_VIOLATIONS violations"
VIOLATIONS=$((VIOLATIONS + TS_VIOLATIONS))

# Check Shell scripts
echo "Checking Shell scripts..."
SH_VIOLATIONS=$(find . -type f -name "*.sh" \
  -exec awk 'length > 80 {print FILENAME":"NR":"$0}' {} \; | wc -l)
echo "  Shell scripts: $SH_VIOLATIONS violations"
VIOLATIONS=$((VIOLATIONS + SH_VIOLATIONS))

# Check SQL files
echo "Checking SQL files..."
SQL_VIOLATIONS=$(find . -type f -name "*.sql" \
  -exec awk 'length > 80 {print FILENAME":"NR":"$0}' {} \; | wc -l)
echo "  SQL files: $SQL_VIOLATIONS violations"
VIOLATIONS=$((VIOLATIONS + SQL_VIOLATIONS))

# Check YAML files
echo "Checking YAML files..."
YAML_VIOLATIONS=$(find .github/workflows -type f -name "*.yml" \
  -exec awk 'length > 80 {print FILENAME":"NR":"$0}' {} \; 2>/dev/null | wc -l)
echo "  YAML files: $YAML_VIOLATIONS violations"
VIOLATIONS=$((VIOLATIONS + YAML_VIOLATIONS))

echo ""
DIVIDER="============================================"
echo "$DIVIDER"
if [ $VIOLATIONS -eq 0 ]; then
    echo -e "${GREEN}✅ All source files comply with" \
      "80-character limit!${NC}"
else
    echo -e "${YELLOW}⚠️  Found $VIOLATIONS lines exceeding" \
      "80 characters${NC}"
    echo ""
    echo "Run this command to see details:"
    echo "  find . -type f \( -name '*.ts' -o -name '*.js'" \
      "-o -name '*.sh' -o -name '*.sql' \) ! -path" \
      "'*/node_modules/*' ! -path '*/dist/*' ! -name" \
      "'package-lock.json' -exec awk 'length > 80 {print" \
      "FILENAME\":\"NR\":\"substr(\$0,1,80)\"...\"}' {} \\;"
fi
echo "$DIVIDER"
echo ""

# Check if configuration files exist
echo "📋 Checking configuration files..."
if [ -f ".editorconfig" ]; then
    echo -e "  ${GREEN}✅ .editorconfig exists${NC}"
else
    echo -e "  ${RED}❌ .editorconfig missing${NC}"
fi

if [ -f ".prettierrc.json" ]; then
    echo -e "  ${GREEN}✅ .prettierrc.json exists${NC}"
else
    echo -e "  ${RED}❌ .prettierrc.json missing${NC}"
fi

if [ -f ".prettierignore" ]; then
    echo -e "  ${GREEN}✅ .prettierignore exists${NC}"
else
    echo -e "  ${RED}❌ .prettierignore missing${NC}"
fi

echo ""
echo "✨ Verification complete!"

#!/bin/bash

# Paxuri Enterprises Web App - Directory & File Setup Script
echo "Creating Paxuri Enterprises directory structure..."

# Create directories
mkdir -p prisma/migrations
mkdir -p public/{images,documents,logos}
mkdir -p src/app/\(marketing\)/{about,services,contact}
mkdir -p src/app/\(shop\)/{catalogue,cart,checkout}
mkdir -p src/app/\(labour\)/{register-fundi,find-talent,jobs}
mkdir -p src/app/\(projects\)/{portfolio,tenders,request-quote}
mkdir -p src/app/\(auth\)/{login,register}
mkdir -p src/app/admin/{dashboard,products,orders,fundis,jobs,settings}
mkdir -p src/app/api/{auth,mpesa,webhooks,v1}
mkdir -p src/components/{ui,layout,forms,shared}
mkdir -p src/features/{auth,catalogue,ecommerce,labour,projects,services,cms,admin}
mkdir -p src/lib/{db,mpesa,email,sms,storage,whatsapp,utils}
mkdir -p src/hooks src/types src/styles

# Create root files
touch .env.local next.config.js tailwind.config.ts tsconfig.json package.json

# Create Prisma files
touch prisma/schema.prisma

# Create App Router pages
touch src/app/layout.tsx src/app/globals.css
touch src/app/\(marketing\)/page.tsx src/app/\(marketing\)/about/page.tsx src/app/\(marketing\)/services/page.tsx src/app/\(marketing\)/contact/page.tsx
touch src/app/\(shop\)/catalogue/page.tsx src/app/\(shop\)/cart/page.tsx src/app/\(shop\)/checkout/page.tsx
touch src/app/\(labour\)/register-fundi/page.tsx src/app/\(labour\)/find-talent/page.tsx src/app/\(labour\)/jobs/page.tsx
touch src/app/\(projects\)/portfolio/page.tsx src/app/\(projects\)/tenders/page.tsx src/app/\(projects\)/request-quote/page.tsx
touch src/app/\(auth\)/login/page.tsx src/app/\(auth\)/register/page.tsx
touch src/app/admin/dashboard/page.tsx src/app/admin/products/page.tsx src/app/admin/orders/page.tsx src/app/admin/fundis/page.tsx src/app/admin/jobs/page.tsx src/app/admin/settings/page.tsx

# Create API routes
touch src/app/api/auth/route.ts src/app/api/mpesa/route.ts src/app/api/webhooks/route.ts src/app/api/v1/route.ts

echo "Setup complete. You can now start adding code to the files."
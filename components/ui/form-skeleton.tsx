import { Skeleton } from "./skeleton";

interface FormSkeletonProps {
  type?: "default" | "form-with-dropdowns" | "list-form" | "input-form" | "tabs-form";
}

export function FormSkeleton({ type = "default" }: FormSkeletonProps) {
  switch (type) {
    case "form-with-dropdowns":
      return <DropdownFormSkeleton />;
    case "list-form":
      return <ListFormSkeleton />;
    case "input-form":
      return <InputFormSkeleton />;
    case "tabs-form":
      return <TabsFormSkeleton />;
    default:
      return <DefaultFormSkeleton />;
  }
}

function DefaultFormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-20 w-full rounded-md bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function DropdownFormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function ListFormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-1/3 rounded-md bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function InputFormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-20 w-full rounded-md bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function TabsFormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-md bg-muted-foreground/20" />
        <Skeleton className="h-10 w-24 rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        <Skeleton className="h-10 w-1/3 rounded-md bg-muted-foreground/20" />
      </div>
    </div>
  );
}

// Inline skeleton for dropdown fields
export function DropdownSkeleton() {
  return <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />;
}

// Inline skeleton for input fields
export function InputSkeleton() {
  return <Skeleton className="h-10 w-full rounded-md bg-muted-foreground/20" />;
}

// Inline skeleton for textareas
export function TextareaSkeleton() {
  return <Skeleton className="h-20 w-full rounded-md bg-muted-foreground/20" />;
}

// Inline skeleton for table/list items
export function ListItemSkeleton() {
  return <Skeleton className="h-16 w-full rounded-md bg-muted-foreground/20" />;
}

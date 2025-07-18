import { Button } from '@/components/common/ui/button';
import { H1, H2, Lead, Muted } from '@/components/md';
import { Note } from '@/components/md/alerts';

export default function ExampleComponent() {
  return (
    <div className="space-y-4">
      <H1 className="text-4xl font-bold">TSX Component Example</H1>
      <Lead className="text-lg text-muted-foreground">
        This is an example of a TSX component being rendered in the docs system.
      </Lead>

      <div className="rounded-lg bg-muted p-4">
        <H2 className="mb-2 text-2xl font-semibold">Interactive Features</H2>
        <Muted>
          TSX files can include interactive React components with state,
          effects, and event handlers.
        </Muted>

        <Button
          variant="default"
          size="default"
          onClick={() => alert('Button clicked')}
          className="my-4"
        >
          Shadcn/ui Button
        </Button>
      </div>

      <Note>
        We can do whatever we want in TSX files, just like in regular React
      </Note>
    </div>
  );
}

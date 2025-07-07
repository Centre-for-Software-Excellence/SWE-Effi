import { BookOpen, ExternalLink } from 'lucide-react';

import { CopyButton } from '@/components/common/copy-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/ui/card';
import { H4, Muted } from '../../md';

export default function CitationCard() {
  const bibtexCitation = `@misc{xxxx2025, 
    title={Holistic Evaluation of LLM-Based SWE Scaffolds},
    author={xxx Team}, 
    year={2025},
    url={https://xxx},
    note={Accessed: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}}
}`;
  const apaCitation = `some apa citation here`;
  return (
    <section className="space-y-4">
      <H4>Citation</H4>
      <Muted className="text-muted-foreground">
        How to cite our work in academic publications
      </Muted>
      <div className="relative grid w-full grid-cols-1 gap-6 lg:p-8">
        <Card className="w-auto rounded shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen />
              BibTex Citation
            </CardTitle>

            <CardDescription>For LaTex and reference managers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                <code className="overflow-x-auto">{bibtexCitation}</code>
              </pre>
              <CopyButton text={bibtexCitation} />
            </div>
          </CardContent>
        </Card>
        <Card className="w-auto rounded shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink />
              APA Citation
            </CardTitle>

            <CardDescription>For academic papers and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                <p className="leading-relaxed">{apaCitation}</p>
              </pre>
              <CopyButton text={apaCitation} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

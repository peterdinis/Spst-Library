"use client";

import { trpc } from "@/trpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

export function AdminEntraUsersPanel() {
  const { data, isLoading, error } = trpc.entra.listDirectoryUsers.useQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Načítavam používateľov z Entra…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error.message}</p>;
  }

  const users = data?.users ?? [];
  const errMsg = data?.error;

  return (
    <div className="space-y-4">
      {errMsg ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 flex gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Graph API</p>
            <p className="text-destructive/90 mt-1">{errMsg}</p>
          </div>
        </div>
      ) : null}

      {!users.length && !errMsg ? (
        <p className="text-sm text-muted-foreground">Žiadni používatelia (alebo prázdny tenant).</p>
      ) : null}

      {users.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Meno</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>UPN</TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.displayName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.mail ?? "—"}</TableCell>
                  <TableCell className="text-sm">{u.userPrincipalName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                    {u.id.slice(0, 8)}…
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

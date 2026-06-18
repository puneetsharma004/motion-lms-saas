import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCT } from "@/lib/plans";
import { grantAccess, revokeAccess } from "@/app/admin/actions";

const btn =
  "px-2.5 py-1 rounded-md text-xs font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer";

export default async function AdminUsers() {
  const admin = createAdminClient();
  if (!admin) {
    return (
      <p className="text-sm text-on-surface-variant">
        Set <code className="text-primary">SUPABASE_SERVICE_ROLE_KEY</code> to manage users.
      </p>
    );
  }

  const [{ data: profiles }, { data: ents }] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    admin.from("entitlements").select("user_id, expires_at").eq("product", PRODUCT),
  ]);

  const expiryByUser = new Map<string, string>();
  for (const e of (ents ?? []) as { user_id: string; expires_at: string }[]) {
    expiryByUser.set(e.user_id, e.expires_at);
  }
  const now = new Date().getTime();

  return (
    <div className="glass-card rounded-xl border border-white/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="text-on-surface-variant/70 text-xs">
          <tr className="border-b border-white/10">
            <th className="text-left font-medium px-4 py-2.5">Email</th>
            <th className="text-left font-medium px-4 py-2.5">Joined</th>
            <th className="text-left font-medium px-4 py-2.5">Access</th>
            <th className="text-right font-medium px-4 py-2.5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {((profiles ?? []) as { id: string; email: string; created_at: string }[]).map(
            (u) => {
              const expiry = expiryByUser.get(u.id);
              const activeAccess = expiry ? new Date(expiry).getTime() > now : false;
              return (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2.5 text-white">{u.email}</td>
                  <td className="px-4 py-2.5 text-on-surface-variant">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    {activeAccess ? (
                      <span className="text-accent-lime">
                        until {new Date(expiry as string).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/60">none</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1.5 justify-end">
                      <form action={grantAccess}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="months" value="1" />
                        <button className={btn}>+1mo</button>
                      </form>
                      <form action={grantAccess}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="months" value="14" />
                        <button className={btn}>+14mo</button>
                      </form>
                      {activeAccess && (
                        <form action={revokeAccess}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button className={`${btn} text-error`}>Revoke</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
}

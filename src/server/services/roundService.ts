/**
 * Thin wrapper to fetch a round by id.
 * Replace the implementation with your ORM/DB call (Prisma, TypeORM, Sequelize, raw SQL, etc).
 *
 * The tests mock this module, so you can implement it after applying the patch.
 */
export type Round = {
  id: string;
  start_time?: string | null;
  end_time?: string | null;
  // Add other fields as needed in your app
};

export async function getRoundById(id: string): Promise<Round | null> {
  // TODO: Implement using your DB/ORM. Example (prisma):
  // return prisma.round.findUnique({ where: { id } });
  throw new Error('Implement getRoundById in src/server/services/roundService.ts');
}

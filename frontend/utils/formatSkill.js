export const formatSkill = (skill) => {
  if (typeof skill !== "string") return skill;

  const trimmedSkill = skill.trim();
  return trimmedSkill
    ? trimmedSkill.charAt(0).toUpperCase() + trimmedSkill.slice(1)
    : trimmedSkill;
};

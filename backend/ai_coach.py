def generate_advice(score):

    if score < 3:
        return "Focus on starting small tasks first."

    if score < 6:
        return "Good progress. Improve consistency."

    if score < 9:
        return "Strong productivity. Maintain momentum."

    return "Excellent discipline. Keep this streak alive."
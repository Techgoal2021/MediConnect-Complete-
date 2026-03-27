from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone


@dataclass
class Specialist:
    name: str
    specialization: str
    total_consultations: int = 0
    ratings: list[tuple[float, datetime]] = field(default_factory=list)

    _MAX_CONSULTATIONS = 10000

    def pass_consultations_threshold(self, threshold: int = 1) -> bool:
        """Check if number of consultations is over or equals a minimum
        threshold.

        Args:
            threshold (int, optional): Minimum number of consultations.
            Defaults to 1 for democracy.

        Returns:
            bool
        """
        return self.total_consultations >= threshold

    def get_recent_ratings(self) -> list[tuple[float, datetime]]:
        """Return list of ratings from a four-week window.

        Returns:
            list: Ratings from four weeks ago till now.
        """
        today = datetime.now(timezone.utc)
        four_weeks_ago = today - timedelta(weeks=4)
        return [rating for rating in self.ratings if rating[1] >= four_weeks_ago]

    def calculate_trust_score(self) -> float | None:
        """Calculates the trust score of a specialist
        based on their average ratings and total consultations.

        Returns:
            float | None: Trust score.
            A return value of None means the number of consultations are not enough to generate a trust score.
        """
        if not self.pass_consultations_threshold():
            return None
        recent_ratings = [rating[0] for rating in self.get_recent_ratings()]
        if not recent_ratings:
            return None
        average_rating = round((sum(recent_ratings) / len(recent_ratings)), 1)
        trust_score = (average_rating / 5.0) * 100
        consultation_bonus = (self.total_consultations / self._MAX_CONSULTATIONS) * 10
        trust_score += consultation_bonus
        trust_score = min(trust_score, 100)
        return trust_score

    def get_trust_label(self) -> str | None:
        """Returns a label based on the calculated trust score."""
        trust_score = self.calculate_trust_score()
        if trust_score is None:
            return "Not Rated"
        elif 0 <= trust_score <= 30:
            return "Questionable"
        elif 31 <= trust_score <= 50:
            return "Developing"
        elif 51 <= trust_score <= 74:
            return "Trusted"
        elif 75 <= trust_score <= 100:
            return "Top Rated"

    def add_rating(self, star_value: float) -> None:
        self.ratings.append((star_value, datetime.now()))
        self.total_consultations += 1

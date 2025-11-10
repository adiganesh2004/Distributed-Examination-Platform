package com.distributed_examination.services.results_service.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.distributed_examination.services.results_service.model.CandidateInsight;
import com.distributed_examination.services.results_service.model.CandidatePerformance;
import com.distributed_examination.services.results_service.model.CandidateTestInfo;
import com.distributed_examination.services.results_service.model.QuestionInsight;

@Repository
public class ResultRepository {

	private final JdbcTemplate jdbcTemplate;

	public ResultRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<QuestionInsight> hardestQuestions(String testId) {
		String sql = """
				    SELECT q.question_id,
				           q.question,
				           AVG(CASE WHEN cr.correct_answer = TRUE THEN 1 ELSE 0 END) AS correctness_rate
				    FROM candidate_responses cr
				    JOIN questions q ON cr.question_id = q.question_id
				    WHERE cr.test_id = ?
				    GROUP BY q.question_id, q.question
				    ORDER BY correctness_rate ASC
				    LIMIT 5;
				""";

		return jdbcTemplate.query(sql, new Object[] { testId }, (rs, rowNum) -> {
			QuestionInsight qi = new QuestionInsight();
			qi.setQuestionId(rs.getString("question_id"));
			qi.setQuestion(rs.getString("question"));
			qi.setCorrectnessRate(rs.getDouble("correctness_rate"));
			return qi;
		});
	}

	public List<QuestionInsight> longestTimeQuestions(String testId) {
		String sql = """
				    SELECT q.question_id,
				           q.question,
				           AVG(cr.time_spent) AS avg_time
				    FROM candidate_responses cr
				    JOIN questions q ON cr.question_id = q.question_id
				    WHERE cr.test_id = ?
				    GROUP BY q.question_id, q.question
				    ORDER BY avg_time DESC
				    LIMIT 5;
				""";

		return jdbcTemplate.query(sql, new Object[] { testId }, (rs, rowNum) -> {
			QuestionInsight qi = new QuestionInsight();
			qi.setQuestionId(rs.getString("question_id"));
			qi.setQuestion(rs.getString("question"));
			qi.setAvgTime(rs.getDouble("avg_time"));
			return qi;
		});
	}

	public List<CandidateInsight> leaderboard(String testId) {
		String sql = """
				    SELECT c.candidate_name,
				           ct.score
				    FROM candidate_tests ct
				    JOIN candidate c ON ct.candidate_id = c.candidate_id
				    WHERE ct.test_id = ?
				    ORDER BY ct.score DESC;
				""";

		return jdbcTemplate.query(sql, new Object[] { testId }, (rs, rowNum) -> {
			CandidateInsight ci = new CandidateInsight();
			ci.setCandidateName(rs.getString("candidate_name"));
			ci.setScore(rs.getInt("score"));
			return ci;
		});
	}

	public CandidatePerformance candidatePerformance(String testId, String candidate_id) {
		String sql = """
				    SELECT c.candidate_name,
				           ct.score,
				           AVG(cr.time_spent) AS avg_time,
				           COUNT(cr.question_id) AS total_questions,
				           SUM(CASE WHEN cr.correct_answer IS TRUE THEN 1 ELSE 0 END) AS correct_answers
				    FROM candidate_responses cr
				    JOIN candidate c ON cr.candidate_id = c.candidate_id
				    JOIN candidate_tests ct ON ct.candidate_id = c.candidate_id
				    WHERE cr.test_id = ? AND c.candidate_id = ?
				    GROUP BY c.candidate_name, ct.score;
				""";

		return jdbcTemplate.queryForObject(sql, new Object[] { testId, candidate_id }, (rs, rowNum) -> {
			CandidatePerformance cp = new CandidatePerformance();
			cp.setCandidateName(rs.getString("candidate_name"));
			cp.setScore(rs.getInt("score"));
			cp.setAvgTimePerQuestion(rs.getDouble("avg_time"));
			cp.setTotalQuestions(rs.getInt("total_questions"));
			cp.setCorrectAnswers(rs.getInt("correct_answers"));
			return cp;
		});
	}
	public List<CandidateTestInfo> testsGivenByCandidate(String candidateId) {
    String sql = """
            SELECT 
        ct.test_id,
        t.test_name AS test_name,
        ct.score,
        ct.start_time,
        ct.end_time
    FROM candidate_tests ct
    JOIN tests t ON ct.test_id = t.test_id
    WHERE ct.candidate_id = ?
    ORDER BY ct.start_time DESC
        """;

    return jdbcTemplate.query(sql, new Object[]{candidateId}, (rs, rowNum) -> {
        CandidateTestInfo info = new CandidateTestInfo();
        info.setTestId(rs.getString("test_id"));
        info.setTestName(rs.getString("test_name"));
        info.setScore(rs.getInt("score"));
        return info;
    });
}
	public List<CandidateTestInfo> testsCreatedByAdmin(String adminId) {
		String sql = """
				SELECT 
                test_id,
                test_name
            FROM tests
            WHERE admin_id = ?
            ORDER BY start_time DESC
				""";

		return jdbcTemplate.query(sql, new Object[]{adminId}, (rs, rowNum) -> {
			CandidateTestInfo info = new CandidateTestInfo();
			info.setTestId(rs.getString("test_id"));
			info.setTestName(rs.getString("test_name"));
			return info;
		});
	}
}
